from typing import List, Optional
import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from server import database, models, auth

router = APIRouter()


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    department: Optional[str] = None
    role: str

    class Config:
        from_attributes = True


class MeUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    profile_pic: Optional[str] = None
    # For password change, the current password is required to verify identity
    current_password: Optional[str] = None
    password: Optional[str] = None


class UpdateMe(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    password: Optional[str] = None


class MeOut(BaseModel):
    id: int
    name: str
    email: str
    department: Optional[str] = None
    role: str

    class Config:
        from_attributes = True


@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(database.get_db)):
    users = db.query(models.User).all()
    out = []
    for u in users:
        role_val = getattr(u.role, "value", str(u.role)) if u.role is not None else "employee"
        out.append(UserOut(id=u.id, name=u.name, email=u.email, department=u.department, role=role_val))
    return out


@router.get("/user/me", response_model=MeOut)
def user_me(current_user=Depends(auth.get_current_user)):
    role_val = getattr(current_user.role, "value", str(current_user.role)) if current_user.role is not None else "employee"
    return MeOut(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        department=current_user.department,
        role=role_val,
    )


@router.put("/user/me")
async def update_me(
    update: UpdateMe,
    db: Session = Depends(database.get_db),
    current_user=Depends(auth.get_current_user),
):
    if update.name is not None:
        current_user.name = update.name

    if update.department is not None:
        current_user.department = update.department

    if update.password:
        current_user.password = auth.hash_password(update.password)

    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated", "user": current_user}
