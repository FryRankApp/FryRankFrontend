import { Link } from 'react-router-dom';
import logo from '../../FrenchFryFoodCritic.png';
import { WELCOME_MESSAGE } from '../../constants';
import MessageCard from './MessageCard';
import StoreItems from './StoreItems';

const Homepage = () => {
    return (
        <div className="w-full max-w-5xl">
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 text-white shadow-xl">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-red-500/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
                <h1 className="relative text-center text-4xl font-bold sm:text-5xl">The best fries, <span className="text-amber-300">ranked.</span></h1>
                <div className="relative mx-auto flex w-full max-w-[700px] flex-col justify-between gap-2 pt-4 text-center sm:flex-row">
                    <h4><span className="text-red-600">Read</span> reviews</h4>
                    <h4><span className="text-red-600">Discover</span> fries</h4>
                    <h4><span className="text-red-600">Write</span> a review</h4>
                </div>
                <Link to="/restaurants" className="relative mx-auto mt-6 block w-fit rounded-full bg-white px-6 py-3 text-center text-lg font-semibold text-slate-900 hover:bg-slate-100">
                    Explore restaurants
                </Link>
            </section>
            <section className="mt-6 box-border flex w-full flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white/90 px-4 py-6 shadow-sm md:flex-row md:items-center">
                <img src={logo} className="inline max-h-[300px] w-full object-scale-down md:w-[46%]" alt="food-critic" />
                <div className="w-full md:w-[54%]">
                    <MessageCard message={WELCOME_MESSAGE} />
                </div>
            </section>
            <section className="py-8">
                <div className="flex justify-center p-4">
                    <h1 className="text-3xl font-bold text-slate-900">Shop FryRank Merch</h1>
                </div>
                <div>
                    <StoreItems />
                </div>
            </section>
        </div>
    );
}

export default Homepage;
