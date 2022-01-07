import React, { useContext, useState } from 'react'
import "./ProductListing.css";
import { DataContext } from "../../api/products";
import Card from "../../components/card/Card";
import Category from "../../components/categorycard/Category";

const ProductListing = () => {

    const context = useContext(DataContext);
    const products = context?.products;
    const [category, SetCategory] = useState();

    const uniqueItems = [...new Set(products.map((x) => x.category))];
    const data = [];
    uniqueItems.forEach((unique) => {
        data.push(products.filter((product) => product.category === unique));
    });

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


    return (
        <div>
            <div className="category">
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
            <div className="cardscontainer">{HandleCategory()}</div>
        </div>
    )
}
export default ProductListing;
