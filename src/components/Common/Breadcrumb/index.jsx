import { React } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { pathToPageName } from '../../../routes'
import { PropTypes } from 'prop-types';

const propTypes = {
    aliases: PropTypes.object,
}

const Breadcrumb = ({aliases}) => {
    const location = useLocation()

    let currentLink = ''

    const crumbs = location.pathname.split('/')
        .filter(crumb => crumb !== '')
        .map((crumb, i, arr) => {
            let crumbDisplayName = aliases && aliases[crumb] ? aliases[crumb] : crumb;

            currentLink += `/${crumb}`

            if(arr.length - 1 === i) {
                return (
                    <li className="text-slate-600">
                        {pathToPageName[currentLink] ? pathToPageName[currentLink] : crumbDisplayName}
                    </li>
                )
            }
            else {
                return (
                    <li>
                        <Link to={currentLink}>{pathToPageName[currentLink] ? pathToPageName[currentLink] : crumbDisplayName}</Link>
                    </li>
                )
            }
        })

    return (
        <ol className='mt-2 flex flex-wrap items-center gap-2 text-sm before:content-none'>
            {crumbs}
        </ol>
    )
}

Breadcrumb.propTypes = propTypes;

export default Breadcrumb;
