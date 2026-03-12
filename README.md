# MandiConnect – Direct Farm-to-Retail Marketplace

## Project Structure

```
mandi-connect/
├── backend/           # Django backend
│   ├── config/        # Django project config (settings, urls)
│   ├── users/         # User authentication app
│   ├── crops/         # Crop listing app
│   ├── orders/        # Order management app
│   ├── manage.py
│   └── requirements.txt
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Navbar
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # All page components
│   │   ├── api.js       # Axios instance
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8+

---

## Step 1 — Create the MySQL Database

Open MySQL shell or MySQL Workbench and run:

```sql
CREATE DATABASE mandi_connect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then update `backend/config/settings.py` with your MySQL credentials:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mandi_connect_db',
        'USER': 'root',       # your MySQL username
        'PASSWORD': '',       # your MySQL password
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

---

## Step 2 — Set Up Backend

```bash
cd backend
pip install -r requirements.txt

python manage.py makemigrations users
python manage.py makemigrations crops
python manage.py makemigrations orders
python manage.py migrate

python manage.py createsuperuser
```

When creating the superuser, you'll be prompted for:
- Phone number
- Name
- Location
- Role
- Password

---

## Step 3 — Run Backend

```bash
cd backend
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

---

## Step 4 — Set Up Frontend

```bash
cd frontend
npm install
```

---

## Step 5 — Run Frontend (Development)

```bash
cd frontend
npm run dev
```

Frontend runs at: **http://localhost:5173**

> The Vite dev server proxies `/api` and `/media` requests to Django (port 8000). Both servers must be running simultaneously during development.

---

## Step 6 — Build React for Production

```bash
cd frontend
npm run build
```

This creates `frontend/dist/`. The Django server is configured to serve this as static files.

---

## Step 7 — Single Server Deployment

After building the React app:

```bash
cd backend
python manage.py collectstatic
python manage.py runserver 0.0.0.0:8000
```

Visit **http://localhost:8000** — Django serves the full app.

---

## User Flow

1. **User Registration & Security:** Farmer/Retailer registers → updates Profile → uploads Aadhaar (for identity verification) along with bank/UPI details.
2. **Farmer Lists Crops:** Verified farmer lists crops in the marketplace.
3. **Retailer Browses & Orders:** Retailer browses marketplace → places bulk order.
4. **Payment & Transport (Retailer):** 
   - Retailer pays farmer directly via the generated **UPI Payment Link**.
   - Retailer enters **Transportation Details** (driver, pickup, delivery).
5. **Order Fulfillment:** Farmer verifies payment and updates delivery status to "In Transit" → "Delivered".
6. **History:** Both users track past crops and UPI payment history within their History dashboards.

---

## API Endpoints

### 👤 Authentication & Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | Register new user |
| POST | `/api/login/` | Login (returns JWT) |
| GET/PUT | `/api/profile/` | Get or update profile details (incl. Aadhaar & UPI) |
| POST | `/api/chatbot/` | MandiConnect AI Assistant for help & guidance |

### 🌾 Crops
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crops/` | List all available crops |
| POST | `/api/add-crop/` | Add crop (farmer only) |
| PUT | `/api/update-crop/<id>/` | Update crop (farmer only) |
| DELETE | `/api/delete-crop/<id>/` | Delete crop (farmer only) |

### 📦 Orders & Transport
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/place-order/` | Place order (retailer only, auto-generates payment) |
| GET | `/api/orders/` | Get orders (role-based) |
| POST | `/api/update-order-status/<id>/` | Update order status (farmer only) |
| POST | `/api/transport/<id>/` | Add/update transport details (retailer) |
| PATCH | `/api/transport/status/<id>/` | Update transport delivery status (farmer/retailer) |
| GET | `/api/transport/get/<id>/` | Get transport details for an order |

### 📜 History & Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/history/crops/` | Get list of listed/purchased crops (role-based) |
| GET | `/api/payments/` | View UPI payment history |
| POST | `/api/payments/paid/<id>/` | Mark UPI payment as Paid |

---

## Django Admin

Visit `/admin` to manage Users, Crops, Orders, Transport, and Payment History.
Create a superuser with `python manage.py createsuperuser`.
