This folder is for model-layer modules. In this project, the database is accessed via lightweight query helpers inside `backend/lib/db.js` and route modules. For larger projects, create files here like `purchaseModel.js`, `transferModel.js`, etc., to encapsulate queries and business logic.

Suggested structure:
- `purchaseModel.js` – CRUD and queries for purchases
- `transferModel.js` – CRUD and queries for transfers
- `assignmentModel.js` – CRUD and queries for assignments/expenditures
- `userModel.js` – user and role lookups

All modules should use ESM imports/exports.


