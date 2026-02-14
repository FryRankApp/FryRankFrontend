import {useState} from 'react'
import  GoogleLogin from '../../../containers/Common/GoogleLogin';
import logo from '../../../FryRankLogo.png';
import style from "./style.module.css"
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from "reactstrap";
import {Link} from "react-router-dom";

export default function Header({loggedIn}) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <div className={style.Header}>
            <Navbar className="p-lg-2 sign" dark expand="md">               
                <NavbarBrand href='/'>
                    <Link to="/">
                        <img src={logo} className={style.FryRank} alt="FryRank" />
                    </Link>
                </NavbarBrand>
                
                <NavbarToggler onClick={toggle} />
                
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        <NavItem>  
                            <NavLink>                      
                                <Link to='/restaurants'>
                                    <h4> Restaurants </h4>
                                </Link> 
                            </NavLink>                         
                        </NavItem>

                        <NavItem>  
                            <NavLink>                      
                                <Link to='/recent-reviews'>
                                    <h4> Recent Reviews </h4>
                                </Link> 
                            </NavLink>                         
                        </NavItem>
                        
                        <NavItem> 
                            <NavLink href="https://www.etsy.com/shop/fryrank/" target="_blank" rel="noopener noreferrer">
                                <h4> Merch Shop </h4>
                            </NavLink>
                        </NavItem>

                        <NavItem>  
                            <NavLink href="https://buy.stripe.com/6oU4gygu35Qt9utf351kA00" target="_blank" rel="noopener noreferrer">
                                <h4> Donate </h4>
                            </NavLink>
                        </NavItem>

                        {
                            loggedIn &&
                            <NavItem>
                                <NavLink>
                                    <Link to="/userSettings">
                                        <h4>User Settings</h4>
                                    </Link>
                                </NavLink>
                            </NavItem>
                        }
                    </Nav>
                </Collapse>                      
            </Navbar> 
            
            <div className={style.GoogleLoginContainer}>
                <GoogleLogin/>   
            </div>
        </div>
    )
}