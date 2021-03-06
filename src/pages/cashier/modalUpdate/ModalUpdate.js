import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
import { ApiUrl } from "../../../Url";
import axios from "axios";

export default function ModalUpdate(props) {


    const [cedula, setCedula] = useState();
    const [newBalance, setNewbalance] = useState();
    const [customer, SetCustomer] = useState([]);
    const [info, SetInfo] = useState(false);
    const [paytypeid, setPaytypeid] = useState("");
    const [paycomplement, setPaycomplement] = useState("");

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'COP',
    });

    const InputHandleComplement = () => {
        if (paytypeid ==='Nequi' | paytypeid === 'Banco') {
          return (
            <div className="reference">
              <input
                id="inputcomplement"
                type="text"
                placeholder="Referencia de la Transferencia"
                onChange={(e) => setPaycomplement(e.target.value)}
              />
            </div>
          )
        } else {
          return (<>
          </>)
        }
      }


    const handleClickSearch = () => {
        FindUser()
    }

    const FindUser = () => {
        axios({
            method: "POST",
            url: `${ApiUrl}casher/loginCustomer`,
            headers: { Authorization: `${window.localStorage.getItem("USER_KEY")}` },
            data: { cedula: `${cedula}` },
        })
            .then((res) => {
                if (res.status === 201) {
                    alert("Usuario Encontrado");
                    SetCustomer(res.data);
                    // console.log(res.data.Customer);
                    SetInfo(true);
                }
            })
            .catch((err) => {
                console.log(err);
                alert(
                    "algo ha sucedido,No se encontro el id o el usuario no esta registrado"
                );
            });


    };

    const infoCustomer = () => {
        if (info) {
            return (
                <>
                    <p>Saldo actual: {formatter.format(customer.Customer.currentbalance)}</p>
                    <p>Valor M??ximo recargable: {formatter.format(customer.Customer.credit - customer.Customer.currentbalance)}</p>
                    <p>Cupo del cliente retenido: {formatter.format(customer.Customer.credit)}</p>
                </>
            )
        } else {
            <>

            </>
        }
    }

    const handleClickModal = () => {
        UpdateUser()
    }

    const UpdateUser = () => {
        if (newBalance <= (customer.Customer.credit - customer.Customer.currentbalance)) {
            axios({
                method: "POST",
                url: `${ApiUrl}casher/UpdateCustomerBalance`,
                headers: { Authorization: `${window.localStorage.getItem("USER_KEY")}` },
                data: { cedula: `${cedula}`, amount: `${newBalance}`, paytypeid: `${paytypeid}`, paycomplement: `${paycomplement}` },
            })
                .then((res) => {
                    if (res.status === 201) {
                        alert("Se logro actualizar el saldo");
                        SetInfo(false)
                        document.getElementById("inputid").value = "";
                        document.getElementById("inputBalance").value = "";
                    }
                })
                .catch((err) => {
                    console.log(err);
                    alert(
                        "algo ha sucedido,No se logro actualizar el saldo del cliente"
                    );
                });
        } else {
            alert("El valor ingresado excede el cupo m??ximo recargable, Cambi?? el valor para poder actualizar su saldo");
        }
    };

    if (!props.isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="Modal">
            <div className="Modal__container">
                <button className="Modal__close-button" onClick={props.onClose}>
                    x
                </button>
                <div >
                    <div>
                        <h1>Actualizar Saldo del Cliente</h1>
                        <label>ingrese la cedula del cliente:</label>
                        <input id="inputid" className="inputid" type="text" onChange={(e) => { setCedula(e.target.value); }} required />
                        {infoCustomer()}
                        <button className="btn--cart" onClick={() => handleClickSearch()}>
                            Encontrar Usuario
                        </button>
                        <p>_____________________________________________________</p>
                        <label>ingrese el valor a recargar del cliente:</label>
                        <input className="" id="inputBalance" type="text" onChange={(e) => { setNewbalance(e.target.value); }} required />

                    </div>
                    <label >Tipo de pago: {paytypeid} </label>
                    <div className="paytype_container">
                            <button
                                className="paytype_button"
                                onClick={() => setPaytypeid('Nequi')}
                            >
                                Nequi
                            </button>
                            <button
                                className="paytype_button"
                                onClick={() => setPaytypeid('Efectivo')}
                            >
                                Efectivo
                            </button>
                            <button
                                className="paytype_button"
                                onClick={() => setPaytypeid('Banco')}
                            >
                                Banco
                            </button>
                        </div>
                        {InputHandleComplement()}
                    <button className="btn--cart" onClick={() => handleClickModal()}>
                        Actualizar Saldo
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modalupdatebalance")
    );
}