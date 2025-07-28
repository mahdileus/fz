"use client"
import React from 'react'



import Link from 'next/link'
import { usePathname } from 'next/navigation'


const links = [
    {
        name: "صفحه اصلی",
        path: "/",
    },
    {
        name: "دوره ها",
        path: "/courses",
    },
    {
        name: "پادکست ها",
        path: "/podcasts",
    },
    {
        name: "مقالات",
        path: "/posts",
    },
    {
        name: "درباره ما",
        path: "/about-us",
    },
    {
        name: "تماس باما",
        path: "/contact-us",
    }, {
        name: "داستان من",
        path: "/my-story",
    },
];

function MobileNav() {
    const pathName = usePathname()
    return (
        <nav className='flex flex-col items-start gap-y-5 text-primary text-base font-dana pt-4'>
            {links.map((link, index) => {
                return <Link href={link.path} key={index} className={`${link.path === pathName && "text-secondery"
                    } font-medium hover:text-secondery transition-all`}>
                    {link.name}
                </Link>
            })}
        </nav>
    )
}

export default MobileNav;