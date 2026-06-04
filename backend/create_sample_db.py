import psycopg2
import random
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    db_url = os.getenv("DATABASE_URL")
    # Extract password from DATABASE_URL
    # postgresql://postgres:password@localhost:5432/querygpt
    password = db_url.split(":")[2].split("@")[0]
    
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        user="postgres",
        password=password,
        database="querygpt"
    )
    return conn

def create_sample_db():
    conn = get_db_connection()
    cur = conn.cursor()

    # 2. Create tables
    cur.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        city VARCHAR(50),
        country VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        price DECIMAL(10,2),
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER DEFAULT 1,
        amount DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'completed',
        order_date TIMESTAMP DEFAULT NOW()
    );
    """)

    # 3. Insert sample data
    customers = [
        ('TechCorp Solutions','tech@techcorp.com','Mumbai','India'),
        ('Nexus Logistics','info@nexus.com','Delhi','India'),
        ('Green Energy Co','contact@greenenergy.com','Pune','India'),
        ('Stellar Systems','hello@stellar.com','Bangalore','India'),
        ('Horizon Retail','sales@horizon.com','Chennai','India'),
        ('Blue Wave Inc','info@bluewave.com','Hyderabad','India'),
        ('Prime Solutions','prime@prime.com','Kolkata','India'),
        ('Alpha Ventures','alpha@alpha.com','Ahmedabad','India'),
        ('Beta Corp','beta@beta.com','Jaipur','India'),
        ('Gamma Tech','gamma@gamma.com','Lucknow','India'),
        ('Delta Industries','delta@delta.com','Surat','India'),
        ('Omega Systems','omega@omega.com','Nagpur','India'),
        ('Sigma Retail','sigma@sigma.com','Indore','India'),
        ('Zeta Commerce','zeta@zeta.com','Bhopal','India'),
        ('Eta Solutions','eta@eta.com','Patna','India'),
        ('Theta Group','theta@theta.com','Vadodara','India'),
        ('Iota Ventures','iota@iota.com','Ludhiana','India'),
        ('Kappa Corp','kappa@kappa.com','Agra','India'),
        ('Lambda Tech','lambda@lambda.com','Nashik','India'),
        ('Mu Retail','mu@mu.com','Rajkot','India')
    ]

    for c in customers:
        cur.execute("INSERT INTO customers (name, email, city, country) VALUES (%s, %s, %s, %s) ON CONFLICT (email) DO NOTHING", c)

    products = [
        ('Laptop Pro X','Electronics',75000,50),
        ('Wireless Mouse','Electronics',1500,200),
        ('Office Chair','Furniture',12000,30),
        ('Standing Desk','Furniture',25000,20),
        ('Monitor 27 inch','Electronics',18000,45),
        ('Keyboard Mechanical','Electronics',3500,100),
        ('Webcam HD','Electronics',2500,80),
        ('Headphones Pro','Electronics',5000,60),
        ('Desk Lamp','Furniture',800,150),
        ('USB Hub','Electronics',1200,120),
        ('Notebook Bundle','Stationery',500,300),
        ('Pen Set Premium','Stationery',250,500),
        ('Backpack Pro','Accessories',2000,90),
        ('Phone Stand','Accessories',600,200),
        ('Cable Organizer','Accessories',400,250)
    ]

    for p in products:
        cur.execute("INSERT INTO products (name, category, price, stock) VALUES (%s, %s, %s, %s)", p)

    # Get product IDs and prices for order generation
    cur.execute("SELECT id, price FROM products")
    product_info = cur.fetchall()

    statuses = ['completed','pending','cancelled','shipped']
    
    for _ in range(100):
        customer_id = random.randint(1, 20)
        prod_id, prod_price = random.choice(product_info)
        quantity = random.randint(1, 5)
        amount = quantity * float(prod_price)
        status = random.choice(statuses)
        order_date = datetime.now() - timedelta(days=random.randint(0, 365))
        
        cur.execute("""
            INSERT INTO orders (customer_id, product_id, quantity, amount, status, order_date)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (customer_id, prod_id, quantity, amount, status, order_date))

    conn.commit()
    cur.close()
    conn.close()
    print("Sample database created successfully!")

if __name__ == "__main__":
    create_sample_db()
