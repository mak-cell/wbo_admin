"""Payment routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Payment, WorkerPayout
from app.schemas.schemas import PaymentResponse, PaymentCreate, PaymentUpdate, WorkerPayoutResponse, WorkerPayoutCreate

router = APIRouter(prefix="/payments", tags=["payments"])


@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    """Get payment details."""
    db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return db_payment


@router.patch("/{payment_id}", response_model=PaymentResponse)
def update_payment(payment_id: int, payment_update: PaymentUpdate, db: Session = Depends(get_db)):
    """Update payment status."""
    db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    db_payment.is_paid = payment_update.is_paid
    db.commit()
    db.refresh(db_payment)
    return db_payment


@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    """Create a new payment record."""
    db_payment = Payment(**payment.model_dump())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/", response_model=list[PaymentResponse])
def list_payments(db: Session = Depends(get_db)):
    """List all client payments."""
    return db.query(Payment).all()

# --- Worker Payout Routes ---

@router.get("/payouts/", response_model=list[WorkerPayoutResponse])
def list_worker_payouts(db: Session = Depends(get_db)):
    """List all worker payouts."""
    return db.query(WorkerPayout).all()

@router.post("/payouts/", response_model=WorkerPayoutResponse, status_code=status.HTTP_201_CREATED)
def create_worker_payout(payout: WorkerPayoutCreate, db: Session = Depends(get_db)):
    """Create a worker payout (salary/shoot)."""
    db_payout = WorkerPayout(**payout.model_dump())
    db.add(db_payout)
    db.commit()
    db.refresh(db_payout)
    return db_payout

@router.patch("/payouts/{payout_id}", response_model=WorkerPayoutResponse)
def update_worker_payout_status(payout_id: int, is_paid: bool, db: Session = Depends(get_db)):
    """Mark payout as paid or unpaid."""
    db_payout = db.query(WorkerPayout).filter(WorkerPayout.id == payout_id).first()
    if not db_payout:
        raise HTTPException(status_code=404, detail="Payout not found")
    
    db_payout.is_paid = is_paid
    db.commit()
    db.refresh(db_payout)
    return db_payout
