import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
// import "./Modal.css";
import { ApiUrl } from "../../../Url";
import axios from "axios";
import { DataContext } from "../../../api/products";

import exportFromJSON from 'export-from-json'


export default function ModalExtract(props) {

    const [cedula, setCedula] = useState("");
    const [table, setTable] = useState();

    const context = useContext(DataContext);
    const products = context?.products;


    const handleClickModal = () => {
        ExtractUser()
    }

    const handleClickDownload = () => {
        if (table) {
            const data = table
            const fileName = `Historial_${cedula}`
            const exportType = 'xls'
            exportFromJSON({ data, fileName, exportType })
        }
    }

    const ExtractUser = () => {
        axios({
            method: "POST",
            url: `${ApiUrl}worker/extractCustomerBalance`,
            headers: { "Authorization": `${window.localStorage.getItem("USER_KEY")}` },
            data: { cedula: `${cedula}` },
        })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data.table;
                    data.forEach(function (item) {
                        const product = products.filter((product) => product.productid === item.productid)
                        item.productid = product[0].proname
                        item.PrecioProducto = product[0].price
                        item.FechadeCompra = item.FechadeCompra.substring(0, 10)
                    });
                    setTable(data)
                }
            })
            .catch(() => {
                alert(
                    "Algo ha sucedido, verifica la cedula del cliente"
                );
            });



    };

    const HandleTable = () => {
        if (table) {
            return (
                <div className="table-wrapper" style={{ overflow: "auto" }}>
                    <table className="fl-table sortable" id="usersTable">
                        <thead>
                            <tr>
                                <th>idOrden</th>
                                <th>FechadeCompra</th>
                                <th>TipodeCompra</th>
                                <th>ComplementoPago</th>
                                <th>TotalOrden</th>
                                <th>Cantidad</th>
                                <th>Producto</th>
                                <th>PrecioProducto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {table.map((item) => (
                                <tr className="item">
                                    <td>{item.idOrden}</td>
                                    <td>{item.FechadeCompra}</td>
                                    <td>{item.TipodeCompra}</td>
                                    <td>{item.ComplementoPago}</td>
                                    <td>{item.TotalOrden}</td>
                                    <td>{item.Cantidad}</td>
                                    <td>{item.productid}</td>
                                    <td>${item.PrecioProducto}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return (<>
            </>)
        }
    }

    const handleClickClose = () => {
        setTable()
        props.onClose();
    }


    if (!props.isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="Modal">
            <div className="Modal__containerEx">
                <button className="Modal__close-button" onClick={() => handleClickClose()} >
                    x
                </button>
                <div >
                    <div>
                        <h1>Historial de compras</h1>
                        <label>ingrese la cedula del cliente:</label>
                        <input id="inputid" className="inputid" type="text" onChange={(e) => { setCedula(e.target.value); }} required />
                    </div>
                    {HandleTable()}
                    <button className="btn--cart" onClick={() => handleClickModal()}>
                        Buscar Usuario
                    </button>
                    <div>
                        <button className="btn--cart" onClick={() => handleClickDownload()}>
                            Descargar Historial
                        </button>
                    </div>

                </div>
            </div>
        </div>,
        document.getElementById("modalextractuser")
    );
}