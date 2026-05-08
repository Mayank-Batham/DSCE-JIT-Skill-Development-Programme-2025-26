import "../Stylings/Product.css";

function Product(props) {
  console.log(props);
  return (
    <>
      <div className="container">
        <div className="id">{props.id}</div>
        <div>{props.name}</div>
        <div>{props.quantity}</div>
        <div>Rs {props.price}</div>
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              props.incrementquantity(props.id-1);
            }}
          >
            +
          </button>
          <button type="button" className="btn btn-primary">
            {props.quantity}
          </button>
          <button type="button" className="btn btn-success" onClick={()=>{props.decrementquantity(props.id-1)}}>
            
            -
          </button>
        </div>
        <div>{props.price*props.quantity}</div>
      </div>
    </>
  );
}

export default Product;
