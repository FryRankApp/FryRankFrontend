import monsieur from './monsieur-lefry-t-shirt.png';
import cap from './black-cap.png';
import monk from './fry-monk-black-t-shirt.png';

const StoreItems = () => {

    const items = [
        {
            name: 'Monsieur LeFry T-Shirt',
            image: monsieur,
            link: 'https://www.etsy.com/listing/1795875850/monsieur-le-fry-the-french-fry'
        },
        {
            name: 'Fry Monk T-Shirt',
            image: monk,
            link: 'https://www.etsy.com/listing/1796245424/fry-monk-t-shirt'
        },
        {
            name: 'FryRank Corduroy Cap',
            image: cap,
            link: 'https://www.etsy.com/listing/1796154532/fry-ranker-vintage-corduroy-cap'
        }
    ]

    return (
        <>
            <div className="flex justify-center">
                <h5><a href="https://fryrank.etsy.com/" target="_blank" rel="noreferrer">SEE ALL</a></h5>
            </div>
            <div className="mx-auto flex max-w-full flex-wrap justify-center gap-4">
                {items.map(item => (
                    <div className="my-2 inline w-60 rounded-lg border border-slate-200 bg-white shadow-sm" key={item.name}>
                        <a href={item.link} target="_blank" rel="noreferrer">
                            <img src={item.image} style={{"width": "100%"}} alt={item.name} />
                        </a>
                        <h5 className="px-2 py-3">
                            <a href={item.link} target="_blank" rel="noreferrer">{item.name}</a>
                        </h5>
                    </div>
                ))}
            </div>
        </>
    )
}

export default StoreItems;
