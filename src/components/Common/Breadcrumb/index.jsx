import React, { Fragment } from 'react'
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
                    <Fragment key={currentLink}>
                        <li className="text-slate-600">
                            {pathToPageName[currentLink] ? pathToPageName[currentLink] : crumbDisplayName}
                        </li>
                    </Fragment>
                )
            }
            else {
                return (
                    <Fragment key={currentLink}>
                        <li>
                            <Link to={currentLink}>{pathToPageName[currentLink] ? pathToPageName[currentLink] : crumbDisplayName}</Link>
                        </li>
                        <li aria-hidden="true" className="text-slate-400">/</li>
                    </Fragment>
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
