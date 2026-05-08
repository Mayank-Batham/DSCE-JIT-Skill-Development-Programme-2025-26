// import Navbar from './components/Navbar'
// import {useState} from 'react'
// import ProductList from './components/ProductList';
// function App() {


//     const productlist=[
//       {id:1,name:"iphone",quantity:0,price:40000},
//       {id:2,name:"iphone",quantity:0,price:40000},
//       {id:3,name:"iphone",quantity:0,price:40000}
//     ]

//     let [productliststate,setproductlist]=useState(productlist);

//     const incrementquantity=(index)=>{
//       let temp=[...productliststate];
//       temp[index].quantity++;
//       setproductlist(temp);
//     }

//     const decrementquantity=(index)=>{
//       let temp=[...productliststate];
//       temp[index].quantity==0?0:temp[index].quantity--;
//       setproductlist(temp);
//     }

//     const [theme,settheme]=useState("white");

//     const themeswitcher=()=>{
//       let temptheme=theme;
//       if(temptheme=="white"){
//         document.body.style.backgroundColor="black";
//         settheme("black");
//       }
//       else{
//         document.body.style.backgroundColor="white";
//         settheme("white");
//       }
//     }

//     //api calls : fetch(); 
//       return (
//     <div>
//       <Navbar/>
//       <button onClick={themeswitcher}>{theme}</button>
//         <ProductList productlist={productliststate} incrementquantity={incrementquantity} decrementquantity={decrementquantity} />
//       <footer>
//         <h2>
//           &copy; Madhan Kumar R
//         </h2>
//       </footer>
//     </div>
//   );
// }






import Navbar from './components/Navbar'
import {useState, useEffect} from 'react'
import ProductList from './components/ProductList';
function App() {


    const productlist=[
      {id:1,name:"iphone",quantity:0,price:40000},
      {id:2,name:"iphone",quantity:0,price:40000},
      {id:3,name:"iphone",quantity:0,price:40000}
    ]

    let [productliststate,setproductlist]=useState(productlist);

    const incrementquantity=(index)=>{
      let temp=[...productliststate];
      temp[index].quantity++;
      setproductlist(temp);
    }

    const decrementquantity=(index)=>{
      let temp=[...productliststate];
      temp[index].quantity==0?0:temp[index].quantity--;
      setproductlist(temp);
    }

    const [theme,settheme]=useState("white");

    const themeswitcher=()=>{
      if(theme=="white"){
        settheme("black");
      }
      else{
        settheme("white");
      }
    }

    // useEffect 1: Runs only ONCE when the app first loads (empty dependency array)
    useEffect(()=>{
      console.log("App mounted! This runs only once.");
    },[]);

    // useEffect 2: Runs whenever 'theme' changes — syncs theme with the DOM
    useEffect(()=>{
      console.log("Theme changed to:", theme);
      document.body.style.backgroundColor = theme === "black" ? "black" : "white";
      document.body.style.color = theme === "black" ? "white" : "black";
    },[theme]);

    // useEffect 3: Runs whenever 'productliststate' changes — updates the browser tab title
    useEffect(()=>{
      let totalquantity = productliststate.reduce((sum, product) => sum + product.quantity, 0);
      document.title = totalquantity > 0 ? `Cart (${totalquantity}) - Shop` : "Shop";
      console.log("Cart updated! Total items:", totalquantity);
    },[productliststate]);

    //console.log(productlist);
  return (
    <div>
      <Navbar/>
      <button onClick={themeswitcher}>{theme}</button>

      <main>
        <ProductList productlist={productliststate} incrementquantity={incrementquantity} decrementquantity={decrementquantity} />
      </main>
      <footer>
        <h2>
          &copy; Madhan Kumar R
        </h2>
      </footer>
    </div>
  );
}

export default App;




import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Madhan");

  // Case 1: Runs only once when app loads
  useEffect(() => {
    console.log("App loaded!");
  }, []);

  // Case 2: Runs whenever count changes
  useEffect(() => {
    document.title = "Count: " + count;
    console.log("count is now", count);
  }, [count]);

  // Case 3: Runs whenever name changes
  useEffect(() => {
    console.log("name is now", name);
  }, [name]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add</button>
      <p>Name: {name}</p>
      <button onClick={() => setName(name+"1")}>Change Name</button>
    </div>
  )
}
export default App;