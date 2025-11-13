# 📱 Real-Time Chat App — README

A complete 1-to-1 real-time chat application built with:

- React Native (Expo)
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication

Features include signup/login, real-time messaging, typing indicator, online status, message delivery/read receipts, and conversation list.

## 🚀 Features
- **🔐 Authentication**
  
  Signup & Login using JWT
  
  Secure token-based API calls
- **💬 Real-Time Chat**
  
  Instant messaging using Socket.IO
  
  Typing indicator
  
  Online/Offline status
  
  Delivery status (✓)
  
  Read receipts (✓✓ blue)
  
  Conversation list with last message + unread count
- **🖼 UI**
  
  Clean WhatsApp-style design
  
  Pixel-perfect screens using Figma template
  
  Smooth animations and auto-scroll

## 📁 Folder Structure
```
root/
├── mobile/                # React Native (Expo) app
│   ├── app/
│   │   ├── chat/          # Chat screen(s)
│   │   ├── config/        # API config
│   │   └── context/       # Online status context
│   ├── components/
│   ├── SocketClient.ts
│   └── README.md
└── server/                # Node.js backend
    ├── server.js
    ├── routes/
    ├── controllers/
    ├── models/
    └── db/
```

## 🛠 Backend Setup
1. Install Dependencies
   ```bash
   cd server
   npm install
   ```

2. Create .env
   Create a `.env` file inside `/server`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=*
   ```

3. Run Server
   ```bash
   npm start
   # or with nodemon
   npm run dev
   ```

Backend will run at:
```
http://<your-local-IP>:5000
```

## 📱 Frontend Setup (Expo)
1. Install Dependencies
   ```bash
   cd mobile
   npm install
   ```

2. Update Socket URL
   Inside `mobile/SocketClient.ts`:
   ```ts
   const SOCKET_URL = "http://YOUR-IP:5000";
   ```

   To find your IP (Windows):
   ```bash
   ipconfig
   ```
   Use the IPv4 of your WiFi/network adapter.

3. Configure API URL
   Inside `mobile/app/config/api.ts` set:
   ```ts
   baseURL: "http://YOUR-IP:5000/api"
   ```

4. Run App
   ```bash
   npx expo start
   ```

Open the app on:
- Expo Go (Android / iOS)
- Emulator / Simulator
- Two real devices for real-time testing

## 🌍 Required Environment Variables (Frontend)
Create `mobile/app/config/env.ts` (optional):
```ts
export const API_URL = "http://YOUR-IP:5000";
```
Make sure both API_URL and SOCKET_URL use the same IP.

## 👤 Sample Users (for testing)
User 1  
Email: user1@test.com  
Password: User@001  
Name: User One

User 2  
Email: user2@test.com  
Password: User@002 
Name: User Two

Login using both accounts on two devices to test:
- Real-time messaging
- Typing indicator
- Online status
- Read receipts

## ⚡ Real-Time Flow (Simplified)
1. User logs in → frontend calls `initSocket(userId)`
2. Backend stores connection → emits `user:online`
3. On typing → emits `typing start` / `typing stop`
4. On sending a message → save to database → emit `newMessage`
5. On opening chat → `message:read` event updates blue ticks

Everything syncs instantly across devices.

## 🧪 Testing on Two Devices
- Connect laptop + two phones to same hotspot/Wi‑Fi
- Use IPv4 address (NOT localhost)
- Login two different sample accounts
- Start chatting → you will see typing, online/offline, and read receipts instantly

## 📦 Build APK (Optional)
```bash
npx expo run:android

# or using EAS
# eas build -p android
```

## 🤝 Contributing
Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to modify.

## 📜 License
MIT License

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
