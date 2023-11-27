from sqlalchemy import Column, String, Integer, DateTime, Boolean
from datetime import datetime, timedelta
from app.infrastructure.db import db


class Todo(db.Model):
    __tablename__ = 'todos'

    id = Column(Integer, primary_key=True, autoincrement=True)
    todo = Column(String, nullable=False)
    status = Column(String, default="in progress", nullable=False)
    priority = Column(String, nullable=False)
    due_date = Column(DateTime, default=datetime.utcnow() + timedelta(days=3), nullable=False)
    maker = Column(String)
    is_deleted = Column(Boolean)