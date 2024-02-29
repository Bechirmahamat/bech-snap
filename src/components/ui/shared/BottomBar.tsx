import { bottombarLinks } from '@/constants'
import { Link, NavLink } from 'react-router-dom'

const BottomBar = () => {
    return (
        <section className='bottom-bar'>
            {bottombarLinks.map((link) => {
                return (
                    <NavLink
                        to={link.route}
                        key={link.label}
                        className='flex flex-col rounded-lg p-2 transition group gap-1'
                    >
                        <img
                            src={link.imgURL}
                            alt={link.label}
                            className='group-hover:invert-white'
                        />
                        <p className='tiny-medium text-light-2'>
                            {' '}
                            {link.label}
                        </p>
                    </NavLink>
                )
            })}
        </section>
    )
}
export default BottomBar
