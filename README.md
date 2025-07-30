
# Mini CRM - Backend

A scalable, efficient backend system for managing customer segmentation, campaign delivery, and audience analytics for the Xeno Mini CRM platform. Built using Node.js, Express, TypeScript, MongoDB, Kafka, and Passport.js for OAuth login.

## 🚀 Features

- Customer and Order ingestion using Kafka Pub/Sub model
- Dynamic audience segmentation using rule-based filters
- Campaign creation and message delivery simulation
- Delivery status tracking via Communication Logs
- Google OAuth 2.0 Authentication with JWT & secure cookies
- Swagger documentation available at `/api-docs`

---

## 🛠️ Technologies Used

- **Node.js** + **Express**: Web server
- **TypeScript**: Type safety
- **MongoDB** + **Mongoose**: Database and ODM
- **KafkaJS**: Distributed messaging for ingestion and delivery
- **Passport.js**: Google OAuth login
- **Zod**: Input validation
- **Swagger + YAMLJS**: API documentation
- **Axios**: HTTP client
- **JWT** + **Cookies**: Auth tokens and sessions

---
## Local Setup Instructions

Clone the repository:

```bash
git clone https://github.com/your-username/mini-crm-backend.git
cd mini-crm-backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```bash
# .env.example

NODE_ENV=development
APP_ENV=dev
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/mini-crm

# App URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Auth
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
INTERNAL_SECRET=your_internal_secret

# Kafka
KAFKA_CLIENT_ID=my-app
KAFKA_BROKERS=localhost:9092

```

Run Kafka & Zookeeper using Docker (if not already):

```bash
docker-compose up -d
```

Create Kafka topics (optional but recommended):

```bash
docker exec -it <kafka_container> bash
kafka-topics.sh --create --topic customers --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1
kafka-topics.sh --create --topic orders --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1
kafka-topics.sh --create --topic campaign-delivery --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1
```

Run the backend (development mode):

```bash
npm run dev
```

Access Swagger docs:

```bash
http://localhost:5000/api-docs
```
## Architecture Overview

- Express REST API: Handles all HTTP requests, validation, and routing.
- Kafka Topics: Decouple ingestion and processing for customers, orders, and campaign-delivery.
- Consumers: Save data into MongoDB or trigger delivery simulation.
- Vendor API: Mocks real-world message sending success/failure.
- Delivery Receipt API: Updates communication logs upon delivery report.


## Scripts

```bash
npm run dev        # Development mode
npm run build      # Compile TypeScript
npm start          # Start production server
npm run lint       # Lint the code
```
## Known Limitations / Assumptions

- Kafka consumers simulate delivery with randomized success.
- Delivery receipt API is hit via Axios after artificial delay.
- AI features (like message suggestions) are handled entirely in the frontend.
- Kafka dead-letter queue exists but is not consumed or displayed.
- No role-based access control implemented beyond login verification.
## Authors

- [Aviral Jain](https://github.com/AviralJain32)
Built with ❤️ as part of the Xeno SDE Internship Assignment – 2025

