import {useState} from 'react'
import  GoogleLogin from '../../../containers/Common/GoogleLogin';
import logo from '../../../FryRankLogo.png';
import {Link} from "react-router-dom";

export default function Header({loggedIn}) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/50 bg-white/80 px-4 py-3 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center justify-between">
                    <Link to="/">
                        <img src={logo} className="w-[min(14rem,38vw)] drop-shadow-sm" alt="FryRank" />
                    </Link>
                    <button className="rounded-full border border-slate-300 px-3 py-1 text-slate-800 md:hidden" onClick={toggle}>
                        Menu
                    </button>
                </div>
                <nav className={`${isOpen ? "flex" : "hidden"} flex-col gap-2 rounded-2xl bg-slate-50 p-3 md:flex md:flex-row md:items-center md:gap-5 md:bg-transparent md:p-0`}>
                    <Link className="text-base font-semibold text-slate-800 hover:text-red-600" to='/restaurants'>Restaurants</Link>
                    <Link className="text-base font-semibold text-slate-800 hover:text-red-600" to='/recent-reviews'>Recent Reviews</Link>
                    <a className="text-base font-semibold text-slate-800 hover:text-red-600" href="https://www.etsy.com/shop/fryrank/" target="_blank" rel="noopener noreferrer">Merch Shop</a>
                    <a className="text-base font-semibold text-slate-800 hover:text-red-600" href="https://buy.stripe.com/6oU4gygu35Qt9utf351kA00" target="_blank" rel="noopener noreferrer">Donate</a>
                    {loggedIn && <Link className="text-base font-semibold text-slate-800 hover:text-red-600" to="/userSettings">User Settings</Link>}
                </nav>
            </div>
            <div className="mx-auto mt-2 flex w-full max-w-6xl justify-end px-2">
                <GoogleLogin/>
            </div>
        </header>
    )
}
