import React, { useContext, useState, useEffect } from "react";
import Card from "../../components/card/Card";
import { STOREHOUSE } from "../../Roles";
import { useHistory } from "react-router-dom";

import "./Cashier.css";
import { DataContext } from "../../api/products";
import Category from "../../components/categorycard/Category";
import OrderProductsItem from "../../components/orderProductsItem/OrderProductsItem";
import axios from "axios";
import Recurso1 from "../../Recursos/Recurso 1.png";
import Recurso2 from "../../Recursos/Recurso 2.png";
import { ApiUrl } from "../../Url";
import Modal from "./modalUpdate/ModalUpdate";

const ROLE = window.localStorage.getItem("ROLE");

const Cashier = () => {
  const context = useContext(DataContext);
  const products = context?.products;
  const cart = context?.cart;
  const total = context?.total;

  const [paytype, SetPaytype] = useState();
  const [cartElements, setCartElements] = useState([]);
  const [paytypeStr, SetPaytypeStr] = useState("");
  const [customerid, SetCustomerid] = useState("");
  const [customerCC, SetCustomerCC] = useState("");
  const [category, SetCategory] = useState();
  const [customer, SetCustomer] = useState("");
  const [paytypeOrder, SetPaytypeOrder] = useState("");
  const [paycomplement, SetPaycomplement] = useState("");
  const history = useHistory();

  useEffect(() => {
    ROLE === STOREHOUSE && history.push("/storehouse");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCartElements(cart);
  }, [cart]);

  const uniqueItems = [...new Set(products.map((x) => x.category))];
  const data = [];
  uniqueItems.forEach((unique) => {
    data.push(products.filter((product) => product.category === unique));
  });
  // console.log(data);

  const HandleCustomer = (customerCC) => {
    axios({
      method: "POST",
      url: `${ApiUrl}casher/loginCustomer`,
      headers: { Authorization: `${window.localStorage.getItem("USER_KEY")}` },
      data: { cedula: `${customerCC}` },
    })
      .then((res) => {
        if (res.status === 201) {
          alert("Usuario Encontrado");
          SetCustomerid(res.data.Customer.customer);
          SetCustomer(res.data.Customer.name);

          document.getElementById("cc_cliente").value = "";
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "algo ha sucedido,No se encontro el id o el usuario no esta registrado"
        );
      });
  };
  const HandlePaytype = (props) => {
    if (props === 1) {
      SetPaytype(1);
      SetPaytypeStr("Efectivo");
    }
    if (props === 2) {
      SetPaytype(2);
      SetPaytypeStr("Nequi");
    }

    if (props === 3) {
      SetPaytype(3);
      SetPaytypeStr("Banco");
    }
  };
  const HandlePayOrder = (props) => {
    if (props === "Crédito") {
      SetPaytypeOrder("Crédito");
      SetPaycomplement("pago_con_credito");
      SetPaytype(0);
    }
    if (props === "De_contado") {
      SetPaytypeOrder("De_contado");
      if (paytype === 1) {
        SetPaycomplement("pago_en_efectivo");
        console.log("seteado complemento", paycomplement)
      }
    }
  };

  const handleAddOrder = () => {

    if (paytypeOrder === "") {
      alert("debes seleccionar un tipo de compra para realizar la orden")
    } else {

      if (paycomplement === "" && paytype >= 2 && paytypeOrder === "De_contado") {
        alert("debes ingresar la referencia/numero de la transferencia para completar la orden")
      } else {
        context?.addOrder(
          customerid,
          window.localStorage.getItem("USER_KEY"),
          paytypeOrder,
          paytype,
          paycomplement
        );
        SetCustomer("");
        SetPaytypeStr("");
        SetCustomerCC("");
        SetPaycomplement("");
        SetPaytypeOrder("");
        // document.getElementById("inputcomplement").value = "";
      }

    }
  };

  function HandlePaytypeR() {

    if (paytypeOrder === "De_contado") {
      return (
        <>
          <h3 id="paytypeheader">Tipo de pago: {paytypeStr} </h3>
          <div id="paytypeicons">
            <div className="payicon">
              <img src={Recurso1} alt="Nequi" />
            </div>
            <div className="payicon">
              <img src={Recurso1} alt="Efectivo" />
            </div>
            <div className="payicon">
              {" "}
              <img src={Recurso2} alt="Banco" />
            </div>
          </div>
          <div className="paytype_container">
            <button
              className="paytype_button"
              onClick={() => HandlePaytype(2)}
            >
              Nequi
            </button>
            <button
              className="paytype_button"
              onClick={() => HandlePaytype(1)}
            >
              Efectivo
            </button>
            <button
              className="paytype_button"
              onClick={() => HandlePaytype(3)}
            >
              Banco
            </button>
          </div>
          {/* input complement Nequi/Bancolombia */}
          {InputHandleComplement()}
        </>
      )
    }

  }

  function InputHandleComplement() {
    if (paytype === 2 | paytype === 3) {
      return (
        <div className="reference">
          <input
            id="inputcomplement"
            type="text"
            placeholder="Referencia de la Transferencia"
            onChange={(e) => SetPaycomplement(e.target.value)}
          />
        </div>
      )
    } else {
      return (<>
      </>)
    }
  }

  //Manejo de las categorias
  const HandleSetCategory = (props) => {
    SetCategory(props);
  };
  const HandleCategory = () => {
    if (category === undefined) {
      // console.log("categoria por default");
      return products.map((item) => <Card producto={item}></Card>);
    } else {
      // console.log("categoria:", uniqueItems[category]);
      return data[category].map((item) => <Card producto={item}></Card>);
    }
  };
  const HandleUpdateBalance = () => {
    setOpenModal(true);
  };
  const HandleDeleteCart = () => {
    context?.removeTotal()
    SetCustomer("");
    SetPaytypeStr("");
    SetCustomerCC("");
    SetPaycomplement("");
    SetPaytypeOrder("");
  }

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="containercashier">
      <div className="row">
        <div className="interface">
          <div className="column2">

            <div className="leftspace">
              <h2 style={{ paddingLeft: "20px" }}>
                Menú
                <span>|Categorías</span>
              </h2>
              <div className="order">
                <Category
                  producto={"Todos los productos"}
                  onSet={() => HandleSetCategory()}
                ></Category>
                {uniqueItems.map((item) => (
                  // setCat={()=> SetCategory(uniqueItems.indexOf(item))}
                  <Category
                    producto={item}
                    onSet={() => HandleSetCategory(uniqueItems.indexOf(item))}
                  ></Category>
                ))}
              </div>
              <h2 style={{ paddingLeft: "20px" }}>Realiza tu Pedido</h2>
              <div className="cardscontainer">{HandleCategory()}</div>
            </div>

          </div>
          
          <div className="column1">
            <div className="container_bnt">
              <div className="menubar">
              {/* <button className="btn-update" onClick={() => HandleUpdateBalance()}>
                Actualizar Saldo
              </button> */}
                <h1 style={{ paddingLeft: "20px" }}>Orden  <span className="span">|Resumen Del Pedido</span></h1>
                <button className="btn-update" onClick={() => HandleUpdateBalance()}>
                Actualizar Saldo
              </button>
                <div id="menubarbutton">
                  
                  <button id="delete" onClick={() => HandleDeleteCart()}>
                    Borrar todo
                  </button>
                </div>
                <div className="center-wrapper">
                  <div className="content">
                    {cartElements.map((item) => (
                      <>
                        <OrderProductsItem producto={item} />
                        <div className="line"></div>
                      </>
                    ))}
                    <div className="bag-total">
                      <div
                        className="total"
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <h3>Total: </h3>
                        <h3> ${total} COP</h3>
                      </div>
                      <div>
                        <h3 style={{ marginTop: "10px" }}>
                          Referencia a la factura: <br></br> {customer}
                        </h3>
                        <input
                          id="cc_cliente"
                          type="text"
                          placeholder="Ingresa la cedula del cliente"
                          onChange={(e) => SetCustomerCC(e.target.value)}
                        />
                        <button
                          className="apply"
                          onClick={() => HandleCustomer(customerCC)}
                        >
                          Buscar
                        </button>
                      </div>

                      <h3 id="paytypeheader">Tipo de Compra: {paytypeOrder} </h3>
                      <div className="paytype_container">
                        <button
                          className="paytype_button"
                          onClick={() => HandlePayOrder("De_contado")}
                        >
                          De contado
                        </button>
                        <button
                          className="paytype_button"
                          onClick={() => HandlePayOrder("Crédito")}
                        >
                          Crédito
                        </button>
                      </div>
                      {HandlePaytypeR()}
                      <button
                        className="btn-go-checkout"
                        onClick={() => handleAddOrder()}
                      >
                        Realizar pedido
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={openModal} onClose={() => setOpenModal(false)}
        >
          Lorem
        </Modal>
      </div>
    </div>
  );
};

export default Cashier;
