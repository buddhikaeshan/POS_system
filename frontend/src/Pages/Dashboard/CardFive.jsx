import React from 'react'
import './Dashboard'

function CardFive({ totalCheques, clearCheque, pendingCheque }) {
    return (
        <div className="card h-100">
            <div className="card-header">Supplier Payments</div>
            <div className="card-body">
                <div className="row">

                    <div className="col-12">
                        <h5 className="card-title text-info">Cheques To Be Honoured</h5>
                        <p className="card-text">{totalCheques}</p>
                    </div>
                </div>
                <br />

                <div className="row">
                    <div className="col-6">
                        <h5 className="card-title text-info">Cleared Cheque Amount</h5>
                        <p className="card-text">{clearCheque}</p>
                    </div>

                    <div className="col-6">
                        <h5 className="card-title text-info">Pending Cheque Amount</h5>
                        <p className="card-text">{pendingCheque}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CardFive