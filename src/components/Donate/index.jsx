import { useSelector, useDispatch } from 'react-redux';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';
import { donationsActions } from '../../redux/reducers/donations';
import './style.css';

const FRY_SIZES = [
    { id: 'small', name: 'Small Fries', price: 2, emoji: '🍟' },
    { id: 'medium', name: 'Medium Fries', price: 3, emoji: '🍟' },
    { id: 'large', name: 'Large Fries', price: 4, emoji: '🍟' }
];

const Donate = () => {
    const dispatch = useDispatch();
    const { cart, showCheckout, orderComplete } = useSelector(state => state.donationsReducer);

    const addToCart = (frySize) => {
        dispatch(donationsActions.addToCart(frySize));
    };

    const removeFromCart = (fryId) => {
        dispatch(donationsActions.removeFromCart(fryId));
    };

    const updateQuantity = (fryId, newQuantity) => {
        dispatch(donationsActions.updateQuantity(fryId, newQuantity));
       
    };

    const getTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        // In a real implementation, this would connect to Stripe API
        // For now, we'll just simulate the checkout
        dispatch(donationsActions.startCheckout());
        alert(cart,showCheckout, "stuff etc");
    };

    const handleCompleteOrder = () => {
        // Simulate order completion
        // In real implementation, this would process payment via Stripe
        dispatch(donationsActions.completeOrder());
        // Reset after 3 seconds
        setTimeout(() => {
            dispatch(donationsActions.resetOrder());
        }, 3000);
    };


    if (showCheckout && !orderComplete) {
        return (
            <div className="donate-container">
                <div className="checkout-section">
                    <h1 className="text-danger">Checkout</h1>
                    <div className="order-summary">
                        <h3>Your Order</h3>
                        {cart.map(item => (
                            <div key={item.id} className="order-item">
                                <span>{item.emoji} {item.name} x{item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="order-total">
                            <strong>Total: ${getTotal().toFixed(2)}</strong>
                        </div>
                    </div>
                    <div className="payment-section">
                        <h3>Payment Information</h3>
                        <p className="payment-note">
                            💳 Payment processing will be integrated with Stripe API
                        </p>
                        <p className="payment-note">
                            Your donation supports the FryRank developers! 🍟
                        </p>
                        <Button 
                            color="danger" 
                            size="lg" 
                            className="mt-3"
                            onClick={handleCompleteOrder}
                        >
                            Complete Donation
                        </Button>
                        <Button 
                            color="secondary" 
                            className="mt-3 ms-2"
                            onClick={() => dispatch(donationsActions.cancelCheckout())}
                        >
                            Back to Menu
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (orderComplete) {
        return (
            <div className="donate-container">
                <div className="order-complete">
                    <h1 className="text-danger">🍟 Thank You! 🍟</h1>
                    <h3>Your donation has been received!</h3>
                    <p>You've earned the "Fry Supporter" badge! 🏆</p>
                    <p>This badge will appear on your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="donate-container">
            <div className="donate-header">
                <h1 className="text-danger">Buy the Devs Some Fries! 🍟</h1>
                <p>Support FryRank development by purchasing virtual fries for the team!</p>
            </div>

            <div className="menu-section">
                <h2>Our Menu</h2>
                <div className="fries-menu">
                    {FRY_SIZES.map(fry => (
                        <Card key={fry.id} className="fry-card">
                            <CardBody>
                                <div className="fry-emoji">{fry.emoji}</div>
                                <CardTitle tag="h4">{fry.name}</CardTitle>
                                <div className="fry-price">${fry.price}</div>
                                <Button 
                                    color="danger" 
                                    className="mt-3"
                                    onClick={() => addToCart(fry)}
                                >
                                    Add to Cart
                                </Button>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>

            {cart.length > 0 && (
                <div className="cart-section">
                    <h2>Your Cart</h2>
                    <Card className="cart-card">
                        <CardBody>
                            {cart.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-info">
                                        <span className="cart-emoji">{item.emoji}</span>
                                        <span className="cart-name">{item.name}</span>
                                    </div>
                                    <div className="cart-item-controls">
                                        <Button 
                                            color="secondary" 
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </Button>
                                        <span className="cart-quantity">{item.quantity}</span>
                                        <Button 
                                            color="secondary" 
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </Button>
                                        <span className="cart-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        <Button 
                                            color="danger" 
                                            size="sm"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div className="cart-total">
                                <strong>Total: ${getTotal().toFixed(2)}</strong>
                            </div>
                            <Button 
                                color="danger" 
                                size="lg" 
                                className="mt-3 checkout-button"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default Donate;
