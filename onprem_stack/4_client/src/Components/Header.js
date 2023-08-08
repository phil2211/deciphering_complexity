import * as React from 'react';
import elasticLogo from './elasticsearch_logo.png';
import postgresLogo from './postgres_logo.png';

const Header = () => {
    return (
        <div className='header'>
            <img src={postgresLogo} className='header-image' />
            <img src={elasticLogo} className='header-image' />
        </div>
    );
};

export default Header;