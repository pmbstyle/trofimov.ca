import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogsStore = defineStore('dialogs', () => {
  const content = {
    about: `<p><strong>Greetings, intrepid explorer!</strong>
    <p>Within this box, I stumbled upon a letter that unveils a fascinating individual:</p>
    <p>Meet Slava Trofimov, a Web Wizard hailing from the vibrant city of Toronto, Canada. With over a dozen years of spellbinding experience as a Front End Enchanter and two years delving into the arcane arts of Full Stack Sorcery, Slava is a true maestro of the digital realm.</p>
    <p>In the mystical world of web development, Slava's mastery knows no bounds. From the humble incantations of HTML, CSS, and JavaScript to conjuring magnificent web applications imbued with potent REST APIs using PHP and Node.js, his skills are a sight to behold.</p>
    <p>A seeker of knowledge, Slava is a swift learner, a troubleshooter extraordinaire, and a valuable member of any team. His insatiable thirst for wisdom and penchant for pioneering best practices ensure that he is always on the cutting edge of his craft.</p>
    <p>When he's not weaving digital enchantments, Slava's heart beats to the rhythm of various passions:</p>
    <ul>
    <li>The mystical world of web development, of course!</li>
    <li>Epic quests in the realm of video games.</li>
    <li>Stargazing and capturing the wonders of the cosmos through the lens of astrophotography.</li>
    <li>Harmonizing with the melodies of music.</li>
    <li>Embarking on adventures in the great outdoors.</li>
    <li>Intrigued by the ever-evolving world of technology and enchanted by new opportunities, Slava is a true explorer of the digital frontier.</li>
    </ul>
    <p>As you embark on your journey through this site, may you find inspiration and delight. And should you seek guidance or simply wish to share your own tales of adventure, do not hesitate to reach out.</p>
    <p>May your day be as enchanting as the mysteries of the web itself! ✨🌟</p>`,
    skills: `<p><strong>Greetings, traveler,</strong></p>
    <p>Allow me to regale you with tales of Slava's formidable skills, which are as diverse and impressive as the stars in the night sky.</p>
    <p>His Primary Arsenal:</p>
    <ul>
    <li><strong>Laravel + Vue / React:</strong> With these mighty weapons in his hands, Slava crafts digital realms that are both elegant and powerful.</li>
    <li><strong>CSS Sorcery:</strong> His mastery extends to the arcane arts of SCSS, LESS, TailwindCSS, Bootstrap, and more, wielding them to shape the very fabric of the web.</li>
    <li><strong>Magic of Compilation:</strong>  Using the mystical powers of Vite, Webpack, and Gulp, Slava compiles his creations, bringing them to life with finesse.</li>
    </ul>
    <p>A Trove of Experience:</p>
    <ul>
    <li><strong>Versatile Frameworks and Libraries:</strong> Slava has ventured into many realms, taming Node.js, WordPress, Electron, Opencart, jQuery, and more, harnessing their strengths to his will.</li>
    <li><strong>The Language of the Web:</strong> He speaks the tongues of PHP, JavaScript, and TypeScript, connecting them seamlessly to the likes of MySQL, MongoDB, SQLite, and other data sources.</li>
    <li><strong>Version Control:</strong> With the sacred scrolls of Github and BitBucket, he ensures the integrity of his creations.</li>
    <li><strong>Container Conjuring:</strong> Slava wields Docker, conjuring and shaping environments for his local development endeavors.</li>
    <li><strong>Taskmaster Extraordinaire:</strong> His command of Jira and ClickUp allows him to orchestrate projects with the precision of a seasoned commander.</li>
    <li><strong>Multiverse Explorer:</strong> Navigating the realms of Linux, Mac, and Windows, Slava is truly a denizen of the digital multiverse, adapting effortlessly to each realm's nuances.</li>
    </ul>
    <p>As you traverse the digital landscapes, remember that Slava's skills are like a treasure map, guiding you to new heights of web development mastery. May your own journey be as rich and rewarding as the knowledge he possesses! 🌌🔮✨</p>
    `,
    experience: `<p><strong>Greetings, curious wayfarer,</strong></p>
    <p>Allow me to unveil the captivating tapestry of Slava's recent professional adventures, a testament to his mastery in the ever-evolving realm of web development:</p>
    <p><strong><u>Senior Full Stack Engineer</u></strong><br/>
    Jobscan (Seattle, WA)<br/><i>Feb 2024 - Present</i></p>
    <p>Led core product features development with Vue.js, Vite, Pinia,
        TailwindCSS, and Laravel, improving product quality and user experience. 
        Developed high-quality solutions to product and engineering needs. Boosted product
        test coverage using Vitest and Playwright. Demonstrated creativity and innovation
        in solutions to tasks and resolving problems.</p>
    <p><strong><u>Senior Front End Developer</u></strong><br/>
    Codepxl (Toronto, Canada)<br/><i>Jan 2019 - Feb 2024</i></p>
    <p>In his role as a Senior Front End Developer at Codepxl, Slava has been a guiding light in the creation of digital wonders. His journey in this enchanted realm over the last five years is a testament to his prowess:</p>
    <ul>
      <li><strong>Architect of User-Centric Magic:</strong> Slava orchestrated the translation of UX and business requirements into exquisite coded solutions, placing the user at the heart of every enchantment.</li>
      <li><strong>Team Alchemist:</strong> He summoned and led teams tailored to the unique needs of each project, masterfully estimating and planning development processes in close collaboration with the Product Manager.</li>
      <li><strong>Coding Sorcerer:</strong> Armed with Vue.js and React.js, he conjured captivating features for both the mobile and desktop domains, breathing life into native application designs and transforming them into elegant SPA/SSR creations.</li>
      <li><strong>Web Weaver:</strong> Slava weaved webs of wonder based on Laravel and WordPress, ensuring compatibility across a multitude of browsers and platforms.</li>
      <li><strong>Tool Artisan:</strong> With a craftsman's touch, he enhanced user interaction tools and bestowed design versatility upon his creations.</li>
    </ul>
    <p><strong><u>Front End Developer</u></strong><br/>
    EvolutionInDesignZ (Toronto, Canada)<br/><i>May 2018 - Dec 2018</i></p>
    <p>During his tenure as a Front End Developer at EvolutionInDesignZ, Slava's journey through the digital wilderness continued to dazzle:</p>
    <ul>
      <li><strong>Coding Maestro:</strong> Armed with HTML, CSS/SCSS, and the spellbinding Vue.js, he crafted features for both the mobile and desktop realms, leaving his mark on the digital landscape.</li>
      <li><strong>Scrum Sage:</strong> Slava ventured into the heart of Scrum project management environments, where his expertise contributed to the successful realization of projects.</li>
      <li><strong>Collaborative Enchanter:</strong> He collaborated closely with stakeholders, validating creative proposals and championing design best practices, ensuring that every endeavor was touched by his magic.</li>
      <li><strong>Deadline Magician:</strong> In a fast-paced, deadline-driven environment, Slava worked harmoniously with client services, sales, and the design team, creating digital wonders that defied time constraints.</li>
      <li><strong>Usability and Performance Artisan:</strong> With an eye for detail, he designed and updated layouts that not only dazzled the eye but also met the highest standards of usability and performance.</li>
      <li><strong>Browser Compatibility Maven:</strong> His creations transcended browser boundaries, offering a seamless experience to users across the digital spectrum.</li>
    </ul>
    <p>For a deeper dive into Slava's mystical journey and to uncover the full extent of his magical exploits, I beckon you to explore his LinkedIn profile or Resume section. There, you shall find the complete chronicle of his adventures in the realm of web development. May your own journey be as enchanting as the tales you've uncovered here! 🌟🔮🚀</p>`,
    education: `<p><strong>Greetings, fellow wanderer,</strong></p>
    <p>In this sacred scroll, we unveil the illustrious educational journey of Slava:</p>
    <p><strong><u>Master in Computer Science</u></strong><br/>
    Moscow Technological University<br/><i>2007 - 2008</i></p>
    <p>Here, in the hallowed halls of Moscow Technological University, Slava delved deep into the mysteries of Computer Science, mastering its arcane secrets and emerging as a true scholar of the digital realm.</p>
    <p><strong><u>Diploma in Computer Science</u></strong><br/>
    Moscow Technological University<br/><i>2003 - 2007</i></p>
    <p>During the years 2003 to 2007, Slava embarked on a remarkable quest, earning his Diploma in Computer Science from the very same institution. This marked the beginning of his epic journey into the world of technology and innovation.</p>
    <p>With these sacred educational credentials, Slava has fortified his knowledge and skills, making him a formidable force in the realm of web development.</p>
    <p>May these educational achievements serve as an inspiration on your own path of discovery and adventure! 📜🌟</p>`,
    contacts: `<p><strong>Greetings, intrepid traveler,</strong></p>
    <p>Now that we've set the stage, behold, the keys to unlock the portal to Slava's digital realm:</p>
    <p>Email: 📧 <strong> <a href="mailto:slava@trofimov.ca">slava@trofimov.ca</a></strong>.</p>
    <p>LinkedIn: 💼 <strong><a href="https://www.linkedin.com/in/slava-trofimov-ca">LinkedIn</a></strong>.</p>
    <p>GitHub: 🐱 <strong><a href="https://github.com/pmbstyle">pmbstyle</a></strong>.</p>
    <p>With these mystical coordinates, you can embark on a quest to connect with Slava, delve deeper into his digital world, and perhaps even forge new alliances in the realms of technology and innovation. May your journey be filled with discovery and camaraderie! 🌐🤝🌟</p>`,
    hello: `<h3 class="font-semibold">Hello!</h3>
    <p>My name is Slava Trofimov and I am a Full Stack Web engineer.</p>
    <p>This website represents information about me in several different ways:</p>
    <ul>
      <li><strong>Terminal Interface:</strong> Navigate by entering commands to access content and learn more about various aspects of my journey.</li>
      <li><strong>Interactive Experience:</strong> Immerse yourself in an interactive journey, where you can explore this digital landscape, interact with NPCs, and uncover hidden details.</li>
      <li><strong>Classic Resume:</strong> If you prefer a more traditional approach, you can download a conventional resume that offers a snapshot of my experiences in the field of we development.</li>
      <li><strong>AI chat bot:</strong> Engage in a conversation with Whiskers (click on the cat 🐾 if you can catch him 😂) who can answer questions and provide insights into my experiences and skills.</li>
    </ul>
    <p>For those curious about the inner workings, you can find the source code for this website on my <a href="https://github.com/pmbstyle">Git Profile</a> page.</p>
    <p>Your visit is greatly appreciated, and I wish you a pleasant day ahead! 🌐🌟</p>`,
  }

  const dialogues = ref({
    blacksmith: {
      name: 'blacksmith',
      show: false,
      type: 'skills',
    },
    scarecrow: {
      name: 'scarecrow',
      show: false,
      type: 'experience',
    },
    mailbox: {
      name: 'mailbox',
      show: false,
      type: 'contacts',
    },
    stand: {
      name: 'stand',
      show: false,
      type: 'education',
    },
    statue: {
      name: 'statue',
      show: false,
      type: 'about',
    },
    hello: {
      name: 'hello',
      show: false,
      type: 'hello',
    },
  })

  const names = {
    about: 'Statue',
    skills: 'Blacksmith',
    experience: 'Scarecrow',
    education: 'Bulletin board',
    contacts: 'Mailbox',
  }

  const getDialog = (dialog: keyof typeof content) => {
    return content[dialog]
  }

  const getGameDialog = (type: keyof typeof names) => {
    return {
      name: names[type],
      content: content[type],
    }
  }
  return { getDialog, dialogues, getGameDialog }
})
