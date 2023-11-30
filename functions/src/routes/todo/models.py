from sqlalchemy import Enum
from sqlalchemy import Column, String, Integer, Date, Boolean
from datetime import datetime, timedelta
from infrastructure.db import db


class Todo(db.Model):
    __tablename__ = 'todos'

    id = Column(Integer, primary_key=True, autoincrement=True)
    todo = Column(String, nullable=False)
    status = Column(String, default="in progress", nullable=False)
    priority = Column(Enum('high', 'medium', 'low', name='priority_enum'), nullable=False)
    due_date = Column(Date, default=datetime.utcnow().date() + timedelta(days=3), nullable=False)
    maker = Column(String)
    is_deleted = Column(Boolean, default=False)


    @property
    def formatted_due_date(self):
        return self.due_date.strftime('%d/%m/%Y')