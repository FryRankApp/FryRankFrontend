import { Link } from 'react-router-dom';

import { Button } from '../';

const LinkButton = ({ link, children, color, onClick }) => {
    return (
        <Link to={link}>
            <Button
                children={children}
                color={color}
                onClick={onClick}
            />
        </Link>
    );
}

export default LinkButton;