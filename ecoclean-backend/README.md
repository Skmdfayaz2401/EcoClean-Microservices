# EcoClean – Municipal Smart Waste Telemetry & Route Optimization
## Spring Boot Microservices Backend (Spring Tool Suite 4 & Java 19 Ready)

EcoClean Municipal Solutions is an enterprise smart waste telemetry and route optimization system. This backend is structured as standard Maven multi-module Spring Boot microservices designed to be seamlessly imported, configured, and run in **Spring Tool Suite 4 (STS)** with **Java 19** and **PostgreSQL**.

---

## 1. Prerequisites & Required Versions

- **JDK Version**: **Java JDK 19** (Configured with `<java.version>19</java.version>`)
- **IDE**: **Spring Tool Suite 4 (STS)** or Eclipse for Enterprise Java
- **Build Tool**: **Apache Maven 3.8+**
- **Database**: **PostgreSQL 13+** and **pgAdmin 4**
- **Node.js**: Node 18+ & npm (for running the React frontend)

---

## 2. PostgreSQL Installation & Configuration

### Database Connection Parameters
- **Database Name**: `ecoclean`
- **Username**: `root`
- **Password**: `Sai@2006`
- **Default Host / Port**: `localhost:5432` *(or custom port, e.g., 5433 via `DB_PORT`)*
- **JDBC URL**: `jdbc:postgresql://localhost:5432/ecoclean`

### Creating the Database via pgAdmin or psql:
```sql
-- Connect as superuser and create the ecoclean database & root user:
CREATE ROLE root WITH SUPERUSER LOGIN PASSWORD 'Sai@2006';
CREATE DATABASE ecoclean OWNER root;
GRANT ALL PRIVILEGES ON DATABASE ecoclean TO root;
```

---

## 3. Environment Variables & `.env` Support

All database and security parameters support system environment variables with local defaults:

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `DB_HOST` | PostgreSQL Host | `localhost` |
| `DB_PORT` | PostgreSQL Port | `5432` |
| `DB_NAME` | Database Name | `ecoclean` |
| `DB_USER` / `DB_USERNAME` | Database Username | `root` |
| `DB_PASSWORD` | Database Password | `Sai@2006` |
| `DB_URL` | Direct JDBC Connection URL | `jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}` |
| `JWT_SECRET` | 256-bit Hex Key for JWT tokens | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |

An `.env.example` file is provided in the project root.

---

## 4. How to Import into Spring Tool Suite 4 (STS)

1. Open **Spring Tool Suite 4**.
2. Go to **File** → **Import...**
3. Expand **Maven** → select **Existing Maven Projects** → click **Next**.
4. Click **Browse...** and select the `ecoclean-backend` folder (or the root directory).
5. Ensure all 8 projects are checked:
   - `ecoclean-backend` (parent `pom.xml`)
   - `eureka-server`
   - `api-gateway`
   - `auth-service`
   - `bin-monitoring-service`
   - `collection-service`
   - `route-optimization-service`
   - `notification-service`
6. Click **Finish**.
7. In STS, right-click `ecoclean-backend` → **Maven** → **Update Project...** (or press `Alt + F5`), check **Force Update of Snapshots/Releases**, and click **OK**.

---

## 5. Microservice Ports Summary

| Microservice | Port | Spring Application Name | Role |
| :--- | :--- | :--- | :--- |
| **Netflix Eureka** | `8761` | `EUREKA-SERVER` | Central Service Discovery Registry |
| **API Gateway** | `8080` | `API-GATEWAY` | Unified HTTP Gateway & Dynamic Routing |
| **Auth Service** | `8081` | `AUTH-SERVICE` | JWT Auth, Driver Registration & Approval |
| **Bin Monitoring** | `8082` | `BIN-MONITORING-SERVICE` | Smart Bins & Real-time IoT Telemetry |
| **Collection Service**| `8083` | `COLLECTION-SERVICE` | Municipal Pickup Scheduling & Driver Logs |
| **Route Optimization**| `8084`| `ROUTE-OPTIMIZATION-SERVICE` | Haversine Shortest-Path Route Optimization |
| **Notification Service**| `8085`| `NOTIFICATION-SERVICE` | Real-time System Alerts & Critical Bin Notices |
| **React Frontend** | `3000` | — | Municipal Admin & Driver Portal UI |

---

## 6. Service Startup Order

In **Spring Tool Suite 4**, start the microservices using **Run As → Spring Boot App** in the following exact order:

1. 🐘 **PostgreSQL**: Ensure PostgreSQL server is running.
2. 🧭 **`eureka-server`** (Port `8761`): Start first and wait until initialized at `http://localhost:8761`.
3. 🔐 **`auth-service`** (Port `8081`): Initializes user and driver auth schemas.
4. 🗑️ **`bin-monitoring-service`** (Port `8082`): Seeds smart bins and starts IoT telemetry simulator.
5. 🚛 **`collection-service`** (Port `8083`): Manages pickup dispatch logs.
6. 🗺️ **`route-optimization-service`** (Port `8084`): Calculates nearest-neighbor collection routes.
7. 🔔 **`notification-service`** (Port `8085`): Listens for critical bin events.
8. 🚪 **`api-gateway`** (Port `8080`): Routes all incoming traffic through `lb://` discovery.
9. 💻 **React Frontend** (Port `3000`): Run `npm run dev` in the frontend root directory.

---

## 7. Key System URLs & Seeded Credentials

- **Eureka Dashboard**: [http://localhost:8761](http://localhost:8761)
- **API Gateway Entry**: [http://localhost:8080](http://localhost:8080)
- **Frontend Portal**: [http://localhost:3000](http://localhost:3000)

###  Default Login Credentials
- **Admin Email**: `admin@ecoclean.com`
- **Admin Password**: `admin123`
- **Pre-Approved Driver Email**: `driver@ecoclean.com`
- **Driver Password**: `driver123`

### ✍️ Driver Registration & Approval Workflow
1. A new driver registers on the frontend at `/login` (`POST /api/auth/register-driver`).
2. The account is created with `PENDING` status.
3. The Admin logs in, goes to **Driver Management** (`/admin/drivers`) → **Pending Approvals**, and clicks **Approve**.
4. The status updates to `APPROVED` and the driver can now log in.

---

## 8. Core API Gateway Endpoints

All APIs are accessed through the API Gateway at `http://localhost:8080`:

### Authentication & Drivers (`/api/auth/**`)
- `POST /api/auth/login` - User/Driver Login & JWT Generation
- `POST /api/auth/register-driver` - Register new driver (`PENDING` status)
- `GET  /api/auth/admin/drivers/pending` - List all pending driver applications
- `PUT  /api/auth/admin/drivers/{id}/approve` - Approve driver application
- `PUT  /api/auth/admin/drivers/{id}/reject` - Reject driver application
- `GET  /api/auth/admin/drivers/active` - List all active drivers

### Smart Bin Monitoring (`/api/bins/**`)
- `GET  /api/bins` - Get all smart bins with fill percentages & statuses
- `GET  /api/bins/{id}` - Get bin by ID
- `POST /api/bins` - Create new smart bin
- `PUT  /api/bins/{id}` - Update bin details
- `DELETE /api/bins/{id}` - Delete bin
- `POST /api/bins/simulate-pulse` - Trigger manual IoT telemetry sensor pulse

### Collections (`/api/collections/**`)
- `GET  /api/collections` - Get all collections
- `GET  /api/collections/driver/{driverId}` - Get pickups for driver
- `POST /api/collections` - Schedule new collection
- `PUT  /api/collections/{id}/status` - Update pickup status (`IN_PROGRESS`, `COMPLETED`)

### Route Optimization (`/api/routes/**`)
- `GET  /api/routes` - Get all optimized collection routes
- `POST /api/routes/optimize` - Calculate dynamic nearest-neighbor route for critical bins
- `GET  /api/routes/driver/{driverId}` - Get route assigned to driver

### Notifications (`/api/notifications/**`)
- `GET  /api/notifications` - Get all notifications
- `GET  /api/notifications/unread` - Get unread notifications
- `PUT  /api/notifications/{id}/read` - Mark notification as read
- `POST /api/notifications` - Broadcast alert

---

## 9. Running the React Frontend

From the root project directory:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 10. Verification & Testing

To build the entire backend via Maven from command line or terminal:
```bash
cd ecoclean-backend
mvn clean package -DskipTests
```

All microservices are 100% compliant with standard Maven, Spring Tool Suite 4, Java 19, and PostgreSQL.
