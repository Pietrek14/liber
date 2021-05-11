// dostaje kod i nowe haslo  dopasowuje code to tego w bazie danych
// pobieram email z bazy danych kodow i dopasowuje email do bazy danych uzytkowiknow
// jesli nowe haslo przejdze cala weryfikacje oraz nie jest taki samo jak stare haslo
// to zmienam stare haslo na nowe i zapisuje w bazie danych
// pogchamp


const { Router } = require("express");
const { registerPasswordChange } = require("../database/scripts/register");
const Reader = require("../database/models/reader");
const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const error = require("./scripts/error");