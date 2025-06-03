# UsuAddr Frontend

Angular application for managing **Users** and **Addresses** with authentication and role-based access. This project consumes a Spring Boot REST API.

## 🚀 Features

- Login and logout functionality;
- Register functionality;
- Role-based data management;
- Create, update, delete users;
- Create, update, delete addresses;
- Responsive layout using Bootstrap 5.

## 📦 Technologies

- [Angular 17+](https://angular.io/)
- [Bootstrap 5](https://getbootstrap.com/)
- [RxJS](https://rxjs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## 🛠️ Installation

Make sure you have [Node.js](https://nodejs.org/) (version 18+) and [Angular CLI](https://angular.io/cli) installed.

```bash
npm install -g @angular/cli
```

Clone the repository and install dependencies:

```bash
git clone https://github.com/UgoCesar19/usuaddr-front.git
cd usuaddr-front
npm install
```

## ▶️ Running the Application

Run the Angular development server:

```bash
ng serve
```

Then open your browser and go to:

```
http://localhost:4200
```

The app should redirect you to the login page.
You could log with admin credentials (admin@mail.com with password "admin123"), or register your own account.
After logging in with valid credentials, you will be redirected to the dashboard.

> ⚠️ Make sure the backend is running at the configured base URL in `environment.ts`.

## 🔐 Default Roles

- **ADMINISTRATOR**: Can manage users and addresses (not implemented).
- **NORMAL**: Can view and manage only their own addresses (not implemented).

## 🔧 Configuration

You can change the backend API URL in:

```ts
src/environments/environment.ts
```

Example:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'  // <-- Backend API URL
};
```

Follow the steps for configuring the backend [here](https://github.com/UgoCesar19/useraddr).

## 🚀 Next steps
- Add better user feedback.