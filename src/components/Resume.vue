<script lang="ts" setup>
import pdf from '@/assets/Slava_Trofimov_Front_End(Full_Stack)_Developer.pdf'
const experience = [
    {
        title: 'Senior Front End Developer',
        company: 'Codepxl - Toronto, ON',
        date: 'January 2019 to Present',
        description: [
            'Proficiently employed Vue.js, Nuxt.js, Laravel, WordPress, jQuery, and Vanilla JavaScript for Front End and Full Stack development.',
            'Skillfully translated Figma designs into responsive web interfaces, utilizing HTML5, CSS3 (SASS), and TailwindCSS/Bootstrap.',
            'Demonstrated expertise in building Single Page and Progressive Web Applications while actively contributing to project planning, code structuring, and maintaining legacy code.',
            'Successfully managed a wide range of projects, from small-scale WordPress websites to extensive social networks and multi-application ecosystems.'
        ]
    },
    {
        title: 'Front End Developer',
        company: 'EvolutionInDesignZ - Toronto, ON',
        date: 'May 2018 to December 2018',
        description: [
            'Spearheaded various custom projects spanning across Laravel, WordPress, and Opencart, encompassing diverse industries such as real estate, education, non-profit, large data, and thin-client solutions.',
            'Translated Figma and Sketch designs into cross-platform accessible, SEO-friendly front-end code using a skill set that included HTML5, SASS, JavaScript, Vue.js, Laravel Blade, jQuery, and Bootstrap.',
            'Delivered exceptional results by seamlessly implementing these projects, ensuring they met accessibility standards and SEO requirements while providing top-notch user experiences.'
        ]
    },
    {
        title: 'Web Developer',
        company: 'Electrolight Enterprises - Toronto, ON',
        date: 'August 2017 to May 2018',
        description: [
            'Led the development and ongoing maintenance of custom corporate websites built on WordPress and Opencart, employing a tech stack featuring HTML5, CSS3, JavaScript, and jQuery.',
            'Streamlined operations by seamlessly integrating third-party APIs, transforming mockups into user-friendly interfaces, and enhancing SEO and web accessibility.',
            'Innovatively contributed to end-user training by developing and implementing content management systems and security resource tutorials, empowering teams to utilize web resources efficiently and securely.'
        ]
    },
    {
        title: 'Front End Developer',
        company: 'iMoan.ru - Moscow',
        date: 'August 2015 to July 2017',
        description: [
            'Collaborated seamlessly with cross-functional teams including client services, sales, and design, ensuring project success in a fast-paced, deadline-driven environment.',
            'Successfully crafted and launched e-commerce websites on Opencart and Django framework, utilizing a technology stack that encompassed HTML5, LESS, jQuery, PHP, and Python.',
            'Designed and constructed impactful landing pages and corporate resources to enhance the online presence of the company.',
            'Achieved significant SEO improvements, resulting in remarkable outcomes, and enhanced overall UI/UX to elevate user experiences.'
        ]
    },
    {
        title: 'Lead Front End Developer',
        company: 'Web Solution Ltd. - Moscow',
        date: 'March 2013 to August 2015',
        description: [
            'Spearheaded the design and development of a diverse portfolio of websites, ranging from small-scale WordPress/Joomla-based corporate sites to expansive e-commerce solutions.',
            'Proficiently implemented front-end interfaces using HTML/CSS, jQuery, Bootstrap, and PHP to ensure seamless user experiences.',
            'Conducted market research and successfully integrated SEO best practices, resulting in improved online visibility and search engine rankings.',
            'Fostered strong client relationships by collaborating closely with end clients, facilitating the creation of modern and highly productive web applications.'
        ]
    },
    {
        title: 'Front End Developer',
        company: 'Giftery corp. - Moscow',
        date: 'February 2012 to March 2013',
        description: [
            'Collaborated on corporate websites with Django(Python) backend, applying HTML/CSS, jQuery, and JavaScript to create cross-browser compatible and user-friendly user interfaces.',
            'Established a strong partnership with designers and the development team, actively contributing to the incorporation of modern best practices in website development, ensuring cutting-edge results.'
        ]
    },
    {
        title: 'Front End Developer',
        company: 'Predestination.ru - Moscow',
        date: 'January 2011 to February 2012',
        description: [
            'Contributed to the development of multiple corporate websites using WordPress, skillfully utilizing HTML/CSS, jQuery, JavaScript, and PHP to ensure optimal functionality and aesthetics.',
            "Took charge of the design and development of impactful landing pages and product websites, enhancing the company's online presence and user engagement."
        ]
    }
]
const profile = [
    'HTML5 & CSS3 for precise styling',
    'JavaScript/TypeScript (with or without frameworks)',
    'JavaScript Frameworks (Vue.js, Nuxt.js), Libraries (React.js, jQuery)',
    'Mobile-first, pixel-perfect styling',
    'SPA, PWA, SSR development',
    'CSS Preprocessors (SASS, LESS) and Template Engines (Laravel Blade, PUG)',
    'RESTful Service and Third-Party API interaction',
    'Unit Testing (Jest), Debugging, Application Maintenance',
    'Desktop App Development (Electron.js)',
    'Web Accessibility (WCAG) and SEO Best Practices',
    'Full Stack Development (Laravel, WordPress, Node.js)',
    'Git/Version Control, Pull Requests, Code Reviews'
]
const education = [
    {
        title: 'Master in Computer Science',
        place: 'Moscow State Open University - Moscow',
        date: '2007 to 2008'
    },
    {
        title: 'Diploma in Computer Science',
        place: 'Moscow Technological University - Moscow',
        date: '2003 to 2007'
    }
]
const skills = [
    'Vue.js / Nuxt.js (5 years)',
    'React.js / Next.js (1 year)',
    'HTML5 / SCSS (8 years)',
    'Bootstrap / Tailwindcss (5 years)',
    'Javascript (8 years)',
    'REST (6 years)',
    'jQuery (7 years)',
    'Laravel / PHP (3 years)',
    'MySQL/ MangoDB (6 years)',
    'Node.js (3 years)',
    'TypeScript (2 years)',
    'Responsive styling (8 years)',
    'Webpack / Vite / Gulp (5 years)',
    'WordPress / OpenCart (8 years)',
    'GitHub (6 years)',
    'Docker (4 years)'
]
</script>
<template>
	<article class="resume">
        <h1>Slava Trofimov <span>(<a :href="pdf" target="_blank">download PDF</a>)</span></h1>
        <p><strong>Senior Front End Developer</strong><br/>
        Richmond Hill, ON<br/>
        <a href="mailto:slava@trofimov.ca">slava@trofimov.ca</a><br/>
        <a href="tel:2899808683">+1(289)980-8683</a></p>
        <section>
            <p>
                Front End Developer with strong expertise in JavaScript, Vue.js, REST, and HTML5/SCSS.
                Bring a Full Stack skill set, having worked extensively with Laravel and PHP, contributing to numerous
                Laravel+Vue.js/Nuxt.js projects. I'm also proficient in React.js, WordPress, Opencart, and Electron.js.
                Well-versed in essential development tools like Git and Docker and have experience with collaboration
                platforms such as Figma, Jira/ClickUp, and Slack. Dedication to ongoing enhancement and a knack for
                resolving challenges add value to any development environment.
            </p>
        </section>

        <section>
            <p class="dashed"><strong>Work Profile</strong></p>
            <ul class="my-4 py-2">
                <li v-for="(p,index) in profile" :key="index">
                    {{p}}
                </li>
            </ul>
        </section>

        <section>
            <p class="dashed"><strong>Work Experience</strong></p>
            <p class="my-4 py-2" v-for="(e,index) in experience" :key="index">
                <b>{{e.title}}</b><br/>
                <small>{{e.company}}</small><br/>
                <small>{{e.date}}</small><br/>
                <ul>
                    <li v-for="(d,index) in e.description" :key="index">
                        {{d}}
                    </li>
                </ul>
            </p>
        </section>

        <section>
            <p class="dashed"><strong>Education</strong></p>
            <p v-for="(e,index) in education" :key="index">
                <b>{{e.title}}</b><br/>
                <small>{{e.place}}</small><br/>
                <small>{{e.date}}</small><br/>
            </p>
        </section>

        <section>
            <p class="dashed"><strong>Skills</strong></p>
            <ul>
                <li v-for="(s,index) in skills" :key="index">
                    {{s}}
                </li>
            </ul>
        </section>

        <section>
            <p class="dashed"><strong>Languages</strong></p>
            <ul>
                <li>
                    English - Fluent
                </li>
                <li>
                    Russian - Expert
                </li>
            </ul>
        </section>
    </article>
</template>