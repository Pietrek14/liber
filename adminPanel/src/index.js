const {
	app,
	BrowserWindow,
	ipcMain,
	ipcRenderer,
	BrowserWindowProxy,
} = require("electron");
const path = require("path");
const mongoose = require("mongoose");
const Reader = require("./models/reader");
const Book = require("./models/book");
const Borrow = require("./models/borrow");
const { registerBook } = require("./scripts/register");
const { ObjectID } = require("mongodb");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 900,
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	mainWindow.setResizable(false);

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "login/index.html"));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("connect-mongoose", (event, ...args) => {
	mongoose.connect(
		`mongodb+srv://${args[0]}:${args[1]}@liber.4efko.mongodb.net/liber?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		(err) => {
			if (err) {
				event.reply("connection-error", err);
			} else {
				event.reply("connection-successful", "");
			}
		}
	);
});

ipcMain.on("create-model", (event, ...args) => {
	const Model = mongoose.model(args[0], JSON.parse(args[1]));

	event.reply("model-created", Model);
});

ipcMain.on("verify-user", async (event, arg) => {
	const userQuery = Reader.findOne({ email: arg });

	const user = await userQuery.exec();

	if (!user) {
		event.reply("verification-error", "Nie ma takiego użytkownika.");
		return;
	}

	if (user.whitelisted) {
		event.reply(
			"verification-error",
			"Ten użytkownik został już zweryfikowany."
		);
		return;
	}

	Reader.updateOne({ email: arg }, { whitelisted: true }, (err, res) => {
		if (err) {
			event.reply("verification-error", `Wystąpił błąd serwera: ${err}`);
			return;
		}

		event.reply("verification-successful", arg);
	});
});

ipcMain.on("unverify-user", async (event, arg) => {
	const userQuery = Reader.findOne({ email: arg });

	const user = await userQuery.exec();

	if (!user) {
		event.reply("unverification-error", "Nie ma takiego użytkownika.");
		return;
	}

	if (!user.whitelisted) {
		event.reply(
			"unverification-error",
			"Ten użytkownik nie jest zweryfikowany."
		);
		return;
	}

	Reader.updateOne({ email: arg }, { whitelisted: false }, (err, res) => {
		if (err) {
			event.reply("unverification-error", `Wystąpił błąd serwera: ${err}`);
			return;
		}

		event.reply("unverification-successful", arg);
	});
});

ipcMain.on("get-whitelisted-users", async (event, args) => {
	const query = Reader.find({ whitelisted: true });

	const whitelistedUsers = await query.exec();

	event.returnValue = whitelistedUsers;
});

ipcMain.on("get-books", async (event, args) => {
	const query = Book.find({});

	const books = await query.exec();

	console.log(books[0]._id.toString());

	event.returnValue = books.map((book) => {
		return { ...book._doc, id: book._id.toString() };
	});
});

// ipcMain.on("get-id-from-id", async (event, args) => {
// 	event.returnValue = args[0];
// });

/**
 * @param args Title, author, description, release date, publisher, cover URL, tags, content URL
 * @returns "book-register-successful" event (arg - book) if success; "book-register-failure" if failure
 */
ipcMain.on("register-book", async (event, args) => {
	const book = await registerBook(
		args[0],
		args[1],
		args[2],
		args[3],
		args[4],
		args[5],
		args[6],
		args[7]
	).catch((err) => {
		console.error(err);
	});

	if (book) event.reply("book-register-successful", book.title);
	else event.reply("book-register-failure", "");
});

ipcMain.on("delete-book", async (event, arg) => {
	Borrow.deleteOne({ book: mongoose.Types.ObjectId(arg) }).catch((err) => {
		event.reply("book-deletion-failure", err);
	});
	Book.deleteOne({ _id: mongoose.Types.ObjectId(arg) })
		.then(() => {
			event.reply("book-deletion-successful");
		})
		.catch((err) => {
			event.reply("book-deletion-failure", err);
		});
});
