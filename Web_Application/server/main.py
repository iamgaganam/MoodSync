from fastapi import FastAPI
from server.app.api import auth

app = FastAPI()

# Include authentication routes
app.include_router(auth.router)