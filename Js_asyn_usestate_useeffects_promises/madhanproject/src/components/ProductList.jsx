import Product from "./Product";

function ProductList(props) {
    //console.log(props);
    return ( 
       props.productlist.map((product,i)=>{
            return <Product {...product} key={i} incrementquantity={props.incrementquantity} decrementquantity={props.decrementquantity}/>
       })
    );
}

export default ProductList;