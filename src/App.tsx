import React, {useState} from 'react';
import {Drawer, LinearProgress, Grid, Badge} from '@material-ui/core'
import {useQuery} from "react-query";
import {Wrapper, StyledButton} from './App.styles'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Item from "./Item/Item";
import Cart from "./Cart/Cart";

export type CartItemType = {
    id: number;
    category: string;
    description: string;
    image: string;
    price: number;
    title: string;
    amount: number;
}

const getProducts = async (): Promise<CartItemType[]> =>
    await (await fetch('https://fakestoreapi.com/products')).json()


const App = () => {

    const [cartOpen, setCartOpen] = useState(false)
    const [cartItems, setCartItems] = useState([] as CartItemType[])
    const {data, isLoading, error} = useQuery<CartItemType[]>('products', getProducts)

    const getTotalItem = (items: CartItemType[]) =>
        items.reduce((ack: number, item) => ack + item.amount, 0)

    const handleAddToCart = (clickedItem: CartItemType) => {
        setCartItems(prevState => {
            const isItemInCart = prevState.find(item => item.id === clickedItem.id)
            if (isItemInCart) {
                return prevState.map(item => (
                    item.id === clickedItem.id
                        ?
                        {...item, amount: item.amount + 1}
                        :
                        item
                ))
            }
            return [...prevState, {...clickedItem, amount: 1}]
        })
    }

    const handleRemoveFromCart = (id: number) => {
        setCartItems(prevState => (
            prevState.reduce((ack, item) => {
                if (item.id === id) {
                    if (item.amount === 1) return ack
                    return [...ack, {...item, amount: item.amount - 1}]
                } else {
                    return [...ack, item]
                }
            }, [] as CartItemType[])
        ))
    }

    if (isLoading) return <LinearProgress/>
    if (error) return <div>Something went wrong...</div>

    return (
        <div className="App">
            <Wrapper>
                <Drawer anchor={"right"} open={cartOpen} onClose={() => setCartOpen(!cartOpen)}>
                    <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart}/>
                </Drawer>
                <StyledButton onClick={() => setCartOpen(true)}>
                    <Badge badgeContent={() => getTotalItem(cartItems)}
                           color={"error"}>
                        <AddShoppingCartIcon/>
                    </Badge>
                </StyledButton>

                <Grid container spacing={3}>
                    {data?.map((item) => (
                        <Grid item key={item.id} xs={12} sm={4}>
                            <Item handleAddToCart={handleAddToCart} item={item}/>
                        </Grid>
                    ))}
                </Grid>
            </Wrapper>
        </div>
    );
};

export default App;
