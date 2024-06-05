# xClone

xClone APP 

## Prerequisites

```
Python 3.5>
pip
Docker && docker-compose

```

## Quickstart

1. Clone this project

   ```shell
   git clone https://github.com/Wallison-DEV/xClone.git
   ```

2. Install dependencies:

   ```shell
    # Install dependencies of the backend
    cd backend
    pip install -r requirements.txt

    # Go back to the root directory of the project
    cd ..

    # Install dependencies of the frontend
    cd frontend
    npm install 
   ```

3. Run local dev server:

   ```shell
    # Run the backend server
    cd backend
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver

    # Run the frontend development server
    cd frontend 
    npm run dev
   ```
   
4. Run docker dev server environment:

   ```shell
   docker-compose up -d --build 
   docker-compose exec web python manage.py migrate
   ```

<!-- 5. Run tests inside of docker:

   ```shell
   docker-compose exec web python manage.py test
   ``` -->
