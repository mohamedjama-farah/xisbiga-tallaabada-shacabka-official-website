export type Lang = 'so' | 'en';

export const translations = {
  nav: {
    home: { en: 'Home', so: 'Bogga Hore' },
    about: { en: 'About', so: 'Naga Waran' },
    news: { en: 'News', so: 'Wararka' },
    join: { en: 'Join Us', so: 'Noogu Soo Biir' },
    contact: { en: 'Contact', so: 'Na la Xiriir' },
  },
  hero: {
    tagline: {
      en: 'Building Tomorrow\'s Somalia Together',
      so: 'Somalida Berri Wada Dhisayno',
    },
    subtitle: {
      en: 'The People\'s Progress Party — A new movement for justice, unity, and prosperity.',
      so: 'Xisbiga Tallaabada Shacabka — Dhaqdhaqaaq cusub oo xaq, midnimo, iyo horumar u taagan.',
    },
    cta: { en: 'Join the Movement', so: 'Ku Biir Dhaqdhaqaaqa' },
    learnMore: { en: 'Learn More', so: 'Wax Badan Baaro' },
  },
  about: {
    title: { en: 'About XTS', so: 'Xisbiga XTS' },
    mission: { en: 'Our Mission', so: 'Hadafkeenna' },
    missionText: {
      en: 'Xisbiga Tallaabada Shacabka (XTS) is a progressive political movement dedicated to building a just, united, and prosperous Somalia. We champion the rights of every citizen and work to create a future where all Somalis can thrive.',
      so: 'Xisbiga Tallaabada Shacabka (XTS) waa dhaqdhaqaaq siyaasadeed horumarsan oo u heellan in la dhiso Soomaali cadaalad leh, mideysan, oo horumaraysa. Waxaan u doodnaa xuquuqda muwaadin kasta waxaanaan shaqaynaa si aan mustaqbal loo abuuro oo Soomaalida oo dhan ay ku barwaaqaysato.',
    },
    values: { en: 'Our Values', so: 'Qiyamkeenna' },
  },
  news: {
    title: { en: 'Latest News', so: 'Wararka Ugu Dambeeyay' },
    readMore: { en: 'Read More', so: 'Wax Badan Akhri' },
    noNews: { en: 'No news available yet.', so: 'Wali wax war ah ma jiraan.' },
  },
  join: {
    title: { en: 'Join the Movement', so: 'Ku Biir Dhaqdhaqaaqa' },
    subtitle: {
      en: 'Be part of building a better Somalia. Register as a member today.',
      so: 'Ka qayb noqo dhisidda Soomaali ka wanaagsan. Maanta isdiiwaangeli xubin ahaan.',
    },
    firstName: { en: 'First Name', so: 'Magaca Koowaad' },
    lastName: { en: 'Last Name', so: 'Magaca Dambe' },
    email: { en: 'Email Address', so: 'Cinwaanka Emailka' },
    phone: { en: 'Phone Number', so: 'Lambarka Telefoonka' },
    city: { en: 'City / Region', so: 'Magaalo / Gobol' },
    message: { en: 'Why do you want to join?', so: 'Maxaad jeceshahay inaad ku biirto?' },
    submit: { en: 'Submit Application', so: 'Dir Codsiga' },
    success: { en: 'Application submitted successfully!', so: 'Codsiga si guul leh ayaa loo diray!' },
  },
  contact: {
    title: { en: 'Contact Us', so: 'Nala Xiriir' },
    name: { en: 'Full Name', so: 'Magaca Buuxa' },
    email: { en: 'Email', so: 'Email' },
    subject: { en: 'Subject', so: 'Cinwaan' },
    message: { en: 'Message', so: 'Fariin' },
    send: { en: 'Send Message', so: 'Dir Farrinta' },
    success: { en: 'Message sent successfully!', so: 'Farrinta si guul leh ayaa loo diray!' },
  },
  footer: {
    rights: { en: 'All rights reserved.', so: 'Dhammaan xuquuqdu way xafidan yihiin.' },
    party: { en: 'Xisbiga Tallaabada Shacabka', so: 'Xisbiga Tallaabada Shacabka' },
  },
};

export function t(key: string, lang: Lang): string {
  const keys = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let obj: any = translations;
  for (const k of keys) {
    obj = obj?.[k];
  }
  return obj?.[lang] ?? obj?.en ?? key;
}
