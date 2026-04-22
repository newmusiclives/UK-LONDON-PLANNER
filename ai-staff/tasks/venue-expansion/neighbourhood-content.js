// Content for 10 missing London neighbourhood guides.
// Each entry feeds generate-neighbourhood-guides.js.
module.exports = [
  {
    name: 'Westminster',
    slug: 'westminster',
    meta: 'The complete guide to Westminster, London. Royal palaces, Parliament, Westminster Abbey, St James\'s Park, and the ceremonial heart of the UK.',
    schemaDesc: 'London\'s ceremonial heart — home to Parliament, Westminster Abbey, Buckingham Palace, and centuries of British history.',
    touristType: ['History Lovers', 'First-Timers', 'Royal Fans', 'Photographers'],
    geo: { lat: 51.4994, lng: -0.1270 },
    hero: 'The ceremonial heart of Britain — Parliament, Westminster Abbey, the royal parks, and 1,000 years of history in a single square mile',
    overview: {
      body: [
        'Westminster is where Britain governs itself and where monarchs have been crowned since 1066. Bounded by the Thames to the east, Pimlico to the south, St James\'s Park to the north, and Buckingham Palace to the west, this is the ceremonial, political, and royal heart of London.',
        'Within its compact area you\'ll find the Houses of Parliament and Big Ben, Westminster Abbey, Churchill War Rooms, Tate Britain, Westminster Cathedral, and the long ceremonial sweep of Whitehall — home to 10 Downing Street and the Cenotaph.'
      ],
      vibe: 'Stately and ceremonial. Politicians, civil servants, and tourists move through the same Georgian streets. Grand on every axis.',
      bestFor: 'First-time London visitors, history buffs, royalty watchers, and anyone who wants to tick off the iconic sights.'
    },
    attractions: [
      { name: 'Westminster Abbey', meta: '20 Deans Yard, SW1P 3PA', blurb: 'The coronation church of every British monarch since William the Conqueror in 1066. Gothic masterpiece, Poets\' Corner, and the tombs of Elizabeth I, Isaac Newton, and the Unknown Warrior.' },
      { name: 'Houses of Parliament & Big Ben', meta: 'Westminster, SW1A 0AA', blurb: 'Charles Barry\'s 1870 Gothic Revival palace on the site of the medieval Palace of Westminster. Big Ben (officially the Elizabeth Tower) is the most photographed clock in the world.' },
      { name: 'Churchill War Rooms', meta: 'Clive Steps, King Charles St, SW1A 2AQ', blurb: 'The subterranean WWII cabinet rooms preserved as left on VE Day — including the Map Room and Churchill\'s bedroom. One of London\'s most atmospheric museums.' },
      { name: 'Tate Britain', meta: 'Millbank, SW1P 4RG', blurb: 'The UK\'s national collection of British art from 1500 to today — the world\'s finest Turner collection plus Hogarth, Blake, Gainsborough, and contemporary Turner Prize winners. Free entry.' },
      { name: 'Horse Guards Parade & Changing of the Guard', meta: 'Whitehall, SW1A 2AX', blurb: 'The ceremonial parade ground where Trooping the Colour takes place. Changing of the Queen\'s Life Guard at 11am weekdays, 10am Sundays — quieter than Buckingham Palace and closer up.' }
    ],
    restaurants: [
      { name: 'The Cinnamon Club', meta: '30-32 Great Smith Street, SW1P 3BU · Indian · $$$', blurb: 'Former Westminster library turned jewel of upscale Indian dining. Vivek Singh\'s flagship; pre-theatre £30, set lunch £25.' },
      { name: 'Skylon', meta: 'Belvedere Rd, SE1 8XX · European · $$$', blurb: 'Royal Festival Hall\'s panoramic restaurant and bar with views over Westminster Bridge and Parliament. Pre-theatre menu £35.' },
      { name: 'The Goring Dining Room', meta: '15 Beeston Pl, SW1W 0JW · British · $$$$', blurb: 'The UK\'s only family-owned grand hotel. Royal Warrant holder, Kate Middleton\'s pre-wedding choice, and a Sunday roast trolley that is a national treasure.' },
      { name: 'A. Wong', meta: '70 Wilton Rd, SW1V 1DE · Chinese · $$$$', blurb: 'Two Michelin stars. Andrew Wong\'s extraordinary regional Chinese tasting menu — book 2-3 months ahead. Dim sum lunch £95.' },
      { name: 'Café in the Crypt', meta: 'Trafalgar Square, WC2N 4JJ · British · $', blurb: 'Hearty British lunch buffet in the vaulted crypt of St Martin-in-the-Fields. Proceeds support the church. Queue — it\'s worth it.' }
    ],
    bars: [
      { name: 'The Red Lion', meta: '48 Parliament St, SW1A 2NH', blurb: 'MPs\' after-work local, two minutes from the Commons. Division-bell fitted above the bar; Churchill\'s former local.' },
      { name: 'The Westminster Arms', meta: '9 Storey\'s Gate, SW1P 3AT', blurb: 'Classic Westminster pub with parliamentary clientele. Real ales, pie-and-mash, and a division bell that rings when MPs need to vote.' },
      { name: 'American Bar at The Savoy (nearby)', meta: 'Strand, WC2R 0EZ', blurb: 'The oldest surviving cocktail bar in Britain — Art Deco glamour, a cocktail book of its own. Smart dress required.' },
      { name: 'St Stephen\'s Tavern', meta: '10 Bridge St, SW1A 2JR', blurb: 'Grade II-listed Victorian pub directly opposite Big Ben. Restored interior, tourist-heavy but atmospheric.' },
      { name: 'The Speaker', meta: '46 Great Peter St, SW1P 2HA', blurb: 'A proper local for civil servants — tiny, dog-friendly, unpretentious. Cask ales from Fuller\'s.' }
    ],
    cafes: [
      { name: 'Inn the Park', meta: 'St James\'s Park, SW1A 2BJ', blurb: 'Lakeside wooden café in St James\'s Park with park views, a short menu, and the perfect Whitehall-tourist stop.' },
      { name: 'Regency Café', meta: '17-19 Regency St, SW1P 4BY', blurb: 'An Art Deco caff since 1946 — cholesterol-heavy Full Englishes, formica tables, cash-only, closes at 2:30pm. Pure Westminster classic.' },
      { name: 'Notes Coffee Trafalgar Square', meta: '9 Trafalgar Sq, WC2N 5DS', blurb: 'Specialty coffee by day, wine bar by night. Outdoor Trafalgar Square seats — prime central-London people-watching.' }
    ],
    shopping: [
      '<strong>Westminster Cathedral shop</strong> — religious and cultural gifts, some of the most distinctive London souvenirs.',
      '<strong>Tate Britain Shop</strong> — prints, posters, art books, and the best London museum-shop stationery.',
      '<strong>Parliamentary Bookshop</strong> (12 Bridge St) — Hansard, political biographies, and official Parliament merchandise.',
      '<strong>Cath Kidston & traditional gift shops</strong> along Whitehall for classic London memorabilia.',
      '<strong>Fortnum & Mason</strong> (Piccadilly, 10-min walk) for British food hampers and Royal Warrant-pedigree tea.'
    ],
    tube: [
      { name: 'Westminster', lines: 'Jubilee, District, Circle', note: 'directly under the Houses of Parliament' },
      { name: 'St James\'s Park', lines: 'District, Circle', note: 'closest to Buckingham Palace and the Park' },
      { name: 'Victoria', lines: 'Victoria, District, Circle', note: 'southwest corner — also mainline station' },
      { name: 'Embankment', lines: 'Bakerloo, Northern, District, Circle', note: 'northeast corner by the Thames' }
    ],
    tips: [
      'Book Westminster Abbey online for a timed entry — walk-up queues can be 2 hours in summer.',
      'Visit the Churchill War Rooms on a weekday afternoon for the shortest queues.',
      'Watch the sunset from Westminster Bridge — Parliament glows gold in the golden hour.',
      'Sunday morning Evensong at Westminster Abbey (15:00) is free — no Abbey entry fee required, just attend the service.',
      'The Jewel Tower opposite Parliament (£6) is one of only two surviving buildings of the medieval Palace of Westminster, and gets a fraction of the Abbey\'s crowds.'
    ]
  },
  {
    name: 'Marylebone',
    slug: 'marylebone',
    meta: 'The complete guide to Marylebone, London. Village high street, Wallace Collection, Wigmore Hall, Sherlock Holmes Museum, and the best of independent London.',
    schemaDesc: 'Marylebone is an elegant West End village with boutique shops, Regency architecture, and a cultural density that rewards slow exploration.',
    touristType: ['Culture Seekers', 'Shoppers', 'Foodies', 'Architecture Fans'],
    geo: { lat: 51.5192, lng: -0.1514 },
    hero: 'An elegant West End village of cobbled mews, independent shops, and the best chamber-music hall in Britain',
    overview: {
      body: [
        'Marylebone (pronounced "Marley-bone") sits between Oxford Street and Regent\'s Park — a Georgian grid that feels more village than city. Its curving medieval high street (Marylebone Lane) follows the route of the buried Tyburn river, one of London\'s "lost" waterways.',
        'Within a 15-minute walk you\'ll find the Wallace Collection, Wigmore Hall, Madame Tussauds, Sherlock Holmes Museum, Chiltern Firehouse, and London\'s densest concentration of specialist independent shops.'
      ],
      vibe: 'Quietly prosperous. Design-led. Mid-afternoon coffee and pre-theatre wine. Locals treat it like a village.',
      bestFor: 'Shoppers bored of chain stores, classical music lovers, architecture fans, people who like their London civilised.'
    },
    attractions: [
      { name: 'The Wallace Collection', meta: 'Hertford House, Manchester Square, W1U 3BN', blurb: 'A free museum of Old Master paintings (Fragonard\'s Swing, Frans Hals\' Laughing Cavalier) plus the finest European arms-and-armour collection in Europe. Housed in a glorious Georgian townhouse.' },
      { name: 'Wigmore Hall', meta: '36 Wigmore St, W1U 2BP', blurb: 'The world\'s finest chamber-music recital hall (1901) — 552 seats under a painted cupola, Arts and Crafts decor, legendary acoustics. Sunday coffee concerts £20.' },
      { name: 'Sherlock Holmes Museum', meta: '221b Baker St, NW1 6XE', blurb: 'A Victorian townhouse fully furnished as Conan Doyle described 221b. Weekend queues; book ahead. Combine with the Beatles Store next door.' },
      { name: 'Madame Tussauds', meta: 'Marylebone Rd, NW1 5LR', blurb: 'London\'s most-visited commercial attraction since 1835 — 300+ waxworks from Shakespeare to Taylor Swift. Book timed entry online to skip queues.' },
      { name: 'Daunt Books Marylebone', meta: '83-84 Marylebone High St, W1U 4QW', blurb: 'An Edwardian bookshop arranged by country — the most beautiful travel section anywhere. A pilgrimage site for readers.' }
    ],
    restaurants: [
      { name: 'Chiltern Firehouse', meta: '1 Chiltern St, W1U 7PA · European · $$$$', blurb: 'André Balazs\'s celebrity-haunt converted fire station. Nuno Mendes at the stoves. Hard to book — 28-day window at 9am. Crab doughnuts a signature.' },
      { name: 'The Ivy Marylebone', meta: '96-98 Marylebone Lane, W1U 2QA · European · $$$', blurb: 'The Marylebone branch of the legendary West End brasserie. Shepherd\'s pie, bread-and-butter pudding, reliable charm.' },
      { name: 'Trishna', meta: '15-17 Blandford St, W1U 3DG · Indian · $$$$', blurb: 'Michelin-starred Mumbai-style coastal seafood. Prawn koliwada and Guinea-fowl pepper fry are signatures. Booking essential.' },
      { name: 'Fischer\'s', meta: '50 Marylebone High St, W1U 5HN · European · $$$', blurb: 'Jeremy King\'s Viennese grill — schnitzels, sachertorte, Imperial-era charm. Schnitzel Holstein is the house dish.' },
      { name: 'Patogh', meta: '8 Crawford Place, W1H 5NE · Persian · $', blurb: 'Secret 20-seat Persian gem with London\'s best chelo kabab. BYOB, cash-only, tiny — book ahead.' }
    ],
    bars: [
      { name: 'The Coach Makers Arms', meta: '88 Marylebone Lane, W1U 2PY', blurb: 'Three-floor Georgian pub on the curving medieval high street. Tom Kerridge-adjacent kitchen; Sunday roast a local institution.' },
      { name: 'Purl', meta: '50-54 Blandford St, W1U 7HX', blurb: 'Speakeasy-style basement cocktail bar with vintage decor and vapour-smoked cocktails. Book ahead — small room.' },
      { name: 'The Donovan Bar at Brown\'s Hotel', meta: '33 Albemarle St, W1S 4BP', blurb: 'Technically Mayfair-border but a Marylebone favourite — live jazz, classical cocktails in the oldest five-star hotel in London.' },
      { name: 'The Dover Castle', meta: '43 Weymouth Mews, W1G 7EQ', blurb: 'Hidden mews pub — Victorian tiles, real ales, a quiet pint away from Marylebone Road traffic.' },
      { name: '108 Brasserie Bar', meta: '108 Marylebone Lane, W1U 2QE', blurb: 'Elegant hotel bar of the Marylebone Hotel. Gin library, classic cocktails, outdoor terrace in summer.' }
    ],
    cafes: [
      { name: 'Monocle Café', meta: '18 Chiltern St, W1U 7QA', blurb: 'The magazine-turned-lifestyle-brand\'s Marylebone café. Japanese-Scandi pared-back aesthetic, strong coffee, people-watching with design magazines.' },
      { name: 'La Fromagerie', meta: '2-6 Moxon St, W1U 4EW', blurb: 'Cheese-merchant-and-dining-room — 300 cheeses, daily tasting platters, brilliant charcuterie, rustic breakfasts.' },
      { name: 'Workshop Coffee Marylebone', meta: '75 Wigmore St, W1U 1QD', blurb: 'Brick-and-oak flagship of one of London\'s best specialty roasters. Flat white and pastries, sit-in counter seats.' }
    ],
    shopping: [
      '<strong>Marylebone High Street</strong> — boutique fashion, independent bookshops, deli counters, and the rare anti-chain London high street.',
      '<strong>Chiltern Street</strong> — the most characterful parallel of the High Street. Alfies Antique Market, Skandium, bespoke tailors, and secret jewellers.',
      '<strong>Daunt Books</strong> (83 Marylebone High St) — the Edwardian travel bookshop arranged by country.',
      '<strong>Paul Smith Sale Shop</strong> (23 Avery Row) — year-round 30-50% off Paul Smith runway pieces.',
      '<strong>Cabbages & Roses</strong> (3 Langton St) — classic English country-lifestyle brand.',
      '<strong>Cadenhead\'s Whisky Shop</strong> (26 Chiltern St) — Scotland\'s oldest independent bottler, a whisky pilgrimage site.'
    ],
    tube: [
      { name: 'Baker Street', lines: 'Bakerloo, Jubilee, Metropolitan, Circle, Hammersmith & City', note: 'north-east corner — near Madame Tussauds' },
      { name: 'Bond Street', lines: 'Central, Jubilee, Elizabeth', note: 'south side — shopping entry point' },
      { name: 'Marble Arch', lines: 'Central', note: 'south-west corner — Speakers\' Corner nearby' },
      { name: 'Regent\'s Park', lines: 'Bakerloo', note: 'north-east — closest to Regent\'s Park' }
    ],
    tips: [
      'Sunday morning coffee concerts at Wigmore Hall (£20) are the best value classical music in London.',
      'Marylebone Farmers\' Market (Sundays, Cramer Street car park) is central London\'s most atmospheric weekend market.',
      'The Wallace Collection is free and usually empty — a refuge when central London is too crowded.',
      'Walk the curving Marylebone Lane to Paddington Street Gardens — the buried Tyburn river still influences the street plan.',
      'Chiltern Street looks best at dusk — the gaslights still work, and the bookshop windows glow.'
    ]
  },
  {
    name: 'South Kensington',
    slug: 'south-kensington',
    meta: 'The complete guide to South Kensington. Natural History, Science, V&A Museums, Royal Albert Hall, and the world\'s greatest cultural quarter.',
    schemaDesc: 'South Kensington is London\'s museums quarter — the Natural History, Science, and V&A museums plus the Royal Albert Hall in one compact neighbourhood.',
    touristType: ['Families', 'Culture Seekers', 'Architecture Fans', 'Music Lovers'],
    geo: { lat: 51.4940, lng: -0.1740 },
    hero: 'Three world-class museums, the Royal Albert Hall, and Albertopolis — Prince Albert\'s Victorian vision of a cultural quarter',
    overview: {
      body: [
        'South Kensington is London\'s culture capital — the product of Prince Albert\'s 1850s vision for a cultural quarter funded by the profits of the 1851 Great Exhibition. What resulted is "Albertopolis": the Natural History Museum, Science Museum, V&A, Royal Albert Hall, Royal College of Music, and Imperial College all within 10 minutes of each other.',
        'The area itself is grand and residential — white stucco terraces, embassy flags, and some of London\'s most expensive real estate. Exhibition Road (pedestrianised between the museums and the Hall) is the axis.'
      ],
      vibe: 'Stately and international. French lycée, embassy Saturday, museum-queue Sunday. Families, students, and tourists mingle.',
      bestFor: 'Families with kids, first-timers, culture fanatics, architecture lovers, music fans.'
    },
    attractions: [
      { name: 'Natural History Museum', meta: 'Cromwell Rd, SW7 5BD', blurb: 'Alfred Waterhouse\'s 1881 Romanesque cathedral of natural science. Free entry. Dinosaurs, Hintze Hall\'s blue whale skeleton, the earthquake simulator. Essential for families.' },
      { name: 'V&A Museum', meta: 'Cromwell Rd, SW7 2RL', blurb: 'The world\'s greatest museum of decorative arts and design. Free. Plaster-cast courts, Raphael cartoons, jewellery gallery, fashion collection. Evening openings (Friday) with DJs.' },
      { name: 'Science Museum', meta: 'Exhibition Rd, SW7 2DD', blurb: 'Free. Stephenson\'s Rocket, Watt\'s steam engine, the Apollo 10 command module. IMAX and Wonderlab (interactive galleries) are paid.' },
      { name: 'Royal Albert Hall', meta: 'Kensington Gore, SW7 2AP', blurb: 'Victorian domed concert hall (1871) — home of the BBC Proms, Hendrix\'s 1969 show, Adele\'s live album. Daytime tours £18; Proms standing tickets £8 on the day.' },
      { name: 'Albert Memorial', meta: 'Kensington Gardens, SW7 2AP', blurb: 'A 176-foot Gothic Revival confection commemorating Prince Albert (1872) — gilded, sculpturally crammed, directly opposite the Hall he inspired.' }
    ],
    restaurants: [
      { name: 'Ognisko', meta: '55 Exhibition Rd, SW7 2PG · Polish · $$$', blurb: 'Elevated Polish cuisine inside Ognisko Polskie — beautiful Victorian dining room, duck, pierogi, beetroot. Pre-theatre £25.' },
      { name: 'Daphne\'s', meta: '112 Draycott Ave, SW3 3AE · Italian · $$$', blurb: 'Chelsea-border Italian beloved of the Chelsea set — Diana\'s favourite, still a smart lunch spot.' },
      { name: 'Bombay Brasserie', meta: 'Courtfield Rd, SW7 4QH · Indian · $$$', blurb: 'Former Victorian ballroom turned Indian fine-dining landmark (1982). Sunday buffet lunch £35; conservatory seating lovely.' },
      { name: 'Dishoom Kensington', meta: '4 Derry St, W8 5SE · Indian · $$', blurb: 'Gorgeous Art Deco-listed branch of Dishoom. Bacon naan at breakfast; house chai all day. Walk-in friendly before 11:30am.' },
      { name: 'V&A Café', meta: 'Inside V&A Museum · British · $', blurb: 'The world\'s first museum café (1868) — three Arts and Crafts rooms by William Morris, Edward Poynter, and James Gamble. Free to use even without a museum visit.' }
    ],
    bars: [
      { name: 'The Anglesea Arms', meta: '15 Selwood Terrace, SW7 3QG', blurb: 'A Victorian corner pub with one of South Ken\'s best beer gardens. Hidden off Fulham Road — a locals\' favourite.' },
      { name: 'The Queen\'s Arms', meta: '30 Queen\'s Gate Mews, SW7 5QL', blurb: 'Mews pub seconds from the Royal Albert Hall — ideal pre-Prom pint. Small, atmospheric, no tourist crowd.' },
      { name: 'Drayton Arms', meta: '153 Old Brompton Rd, SW5 0LJ', blurb: 'Victorian pub with a fringe theatre upstairs — good gastropub menu, great wine list, pre-theatre deals.' },
      { name: 'The Builder\'s Arms', meta: '13 Britten St, SW3 3TY', blurb: 'Chelsea-border gastropub with fireplaces and weekend brunches. Sunday roasts are a neighbourhood institution.' },
      { name: 'Blakes Hotel Bar', meta: '33 Roland Gardens, SW7 3PF', blurb: 'Anoushka Hempel\'s black-lacquered boutique hotel bar. Dark, dramatic, famous with fashion-world diners.' }
    ],
    cafes: [
      { name: 'Caffè Concerto', meta: '29-31 Gloucester Rd, SW7 4PL', blurb: 'Belle Epoque patisserie café — afternoon tea, pastries, and a pre-Royal Albert Hall elegant refuge.' },
      { name: 'Kensington Palace Pavilion', meta: 'Kensington Palace, W8 4PX', blurb: 'The Orangery reimagined as a garden-to-table bistro — afternoon tea a calmer alternative to central hotels.' },
      { name: 'Design Museum Café', meta: '224-238 Kensington High St, W8 6AG', blurb: 'Terence Conran-curated canteen in the atrium of the Design Museum. Curated snacks, great coffee, design books to flick through.' }
    ],
    shopping: [
      '<strong>V&A Shop</strong> — arguably the best museum shop in Britain. Fabric, jewellery, prints, design books.',
      '<strong>Natural History Museum Shop</strong> — brilliant kids\' science gifts, dinosaur toys, field guides.',
      '<strong>Harrods</strong> (Knightsbridge, 10-min walk) — the world\'s most famous department store. Food hall is essential.',
      '<strong>Harvey Nichols</strong> (Knightsbridge) — fashion-first alternative to Harrods, 5th-floor food market lovely.',
      '<strong>Conran Shop</strong> (Michelin House) — interiors and design classics in Alain Partouche\'s Art Nouveau tiled former Michelin garage.',
      '<strong>John Sandoe Books</strong> (Blacklands Terrace, Chelsea-border) — three-floor independent bookshop hand-curated for 60 years.'
    ],
    tube: [
      { name: 'South Kensington', lines: 'District, Circle, Piccadilly', note: 'under Exhibition Rd — the museum pedestrian tunnel starts here' },
      { name: 'Gloucester Road', lines: 'District, Circle, Piccadilly', note: 'west side — handy for Royal Albert Hall' },
      { name: 'Knightsbridge', lines: 'Piccadilly', note: 'east side — closest for Harrods and V&A' },
      { name: 'High Street Kensington', lines: 'District, Circle', note: 'north side — Kensington Palace nearby' }
    ],
    tips: [
      'The South Kensington pedestrian subway connects the Tube to all three museums — stay dry in the rain.',
      'Science Museum\'s Wonderlab (£12) is aimed at kids 7-14 and is the best interactive London museum experience for families.',
      'V&A Friday Late (last Friday of the month) is free, adults-only, with DJs and drinks.',
      'Proms standing (promenading) tickets at the Royal Albert Hall are £8 on the day — queue from 11am.',
      'The Michelin House restaurant Bibendum is worth a meal just for the stained-glass tyre-man Michelin cars on the walls.'
    ]
  },
  {
    name: 'City of London',
    slug: 'city-of-london',
    meta: 'The complete guide to the City of London (Square Mile). Wren churches, Roman walls, the Tower, skyscrapers, Leadenhall Market, and 2,000 years of history.',
    schemaDesc: 'The Square Mile — London\'s Roman and medieval core, now the UK\'s financial district, packed with Wren churches, hidden alleys, and skyscrapers.',
    touristType: ['History Buffs', 'Architecture Fans', 'Photographers', 'Business Visitors'],
    geo: { lat: 51.5155, lng: -0.0922 },
    hero: '2,000 years of London history in one square mile — Roman walls, Wren churches, the medieval Guildhall, and Europe\'s most ambitious skyline',
    overview: {
      body: [
        'The City of London (not to be confused with Greater London) is the original Roman Londinium — a one-square-mile local authority that has governed itself since the 12th century. By day it\'s the UK\'s financial capital; by night and weekend, an eerily quiet medieval and Wren-era museum.',
        'Highlights compress into tight walks: St Paul\'s, the Tower, Leadenhall Market, Guildhall, the Barbican, plus the glass-and-steel skyline of the Gherkin, Cheesegrater, Walkie-Talkie, and Scalpel.'
      ],
      vibe: 'Weekday: busy, monied, suited. Weekend: almost abandoned, atmospheric, perfect for photography and slow exploration.',
      bestFor: 'History buffs, architecture nerds, photographers, weekend wanderers who like empty streets.'
    },
    attractions: [
      { name: 'St Paul\'s Cathedral', meta: 'St Paul\'s Churchyard, EC4M 8AD', blurb: 'Sir Christopher Wren\'s 1710 masterpiece, built after the Great Fire. Climb 528 steps to the Golden Gallery (highest public viewpoint in any British cathedral).' },
      { name: 'Tower of London', meta: 'Tower of London, EC3N 4AB', blurb: 'Nearly 1,000 years of royal palace, fortress, and prison. Home to the Crown Jewels and the famous Beefeaters. Arrive 9am to see the Jewels before crowds.' },
      { name: 'Leadenhall Market', meta: 'Gracechurch St, EC3V 1LT', blurb: '19th-century Victorian covered market — the entrance to Diagon Alley in the Harry Potter films. Deserted on weekends; best for photos.' },
      { name: 'Sky Garden', meta: '20 Fenchurch St, EC3M 3BY', blurb: 'The free 35th-floor tropical garden atop the Walkie-Talkie. Book online 3 weeks ahead. Sunset slots go fastest.' },
      { name: 'Guildhall & Roman Amphitheatre', meta: 'Gresham St, EC2V 7HH', blurb: 'The medieval seat of City government, with a 2,000-year-old Roman amphitheatre in the basement (free). Combine with the free Clockmakers\' Museum next door.' }
    ],
    restaurants: [
      { name: 'Sweetings', meta: '39 Queen Victoria St, EC4N 4SA · British · $$$', blurb: 'The City\'s Victorian fish restaurant (1889) — lunchtime-only, cash-preferred, potted shrimps and Dover sole for generations.' },
      { name: 'City Social', meta: 'Tower 42, 25 Old Broad St, EC2N 1HQ · British · $$$$', blurb: 'Jason Atherton\'s 24th-floor Michelin-starred Art Deco restaurant with spectacular skyline views. Set lunch £45.' },
      { name: 'The Ivy Asia St Paul\'s', meta: '20 New Change, EC4M 9AG · Asian · $$$', blurb: 'Glitzy pan-Asian Ivy group outpost with a cathedral-facing terrace and emerald-green illuminated floor.' },
      { name: 'Duck & Waffle', meta: '110 Bishopsgate, EC2N 4AY · European · $$$$', blurb: 'Britain\'s highest 24-hour restaurant on the 40th floor of the Heron Tower. The namesake duck & waffle dish £20.' },
      { name: 'Hawksmoor Guildhall', meta: '10 Basinghall St, EC2V 5BQ · British · $$$$', blurb: 'Longhorn beef and lamb chops in a City chop house. Express menu £30 weekdays 5-6:30pm.' }
    ],
    bars: [
      { name: 'Ye Olde Cheshire Cheese', meta: '145 Fleet St, EC4A 2BU', blurb: 'Rebuilt in 1667 after the Great Fire; Dickens, Dr Johnson, and Mark Twain drank here. Low ceilings, dark wood, medieval cellar bar.' },
      { name: 'The Jerusalem Tavern', meta: '55 Britton St, EC1M 5UQ', blurb: 'A 1720 Clerkenwell-border gem — St Peter\'s Brewery\'s tiny tap, feels like a time capsule. Squeeze onto a bench.' },
      { name: 'Oriole', meta: 'East Poultry Ave, Smithfield, EC1A 9LH', blurb: 'Smithfield\'s underground cocktail bar from the Nightjar team. Live jazz nightly, global cocktail menu.' },
      { name: 'The Viaduct Tavern', meta: '126 Newgate St, EC1A 7AA', blurb: 'An 1869 Victorian gin palace opposite the Old Bailey — gilded mirrors, etched glass, cells from Old Newgate Prison in the basement.' },
      { name: 'Coq d\'Argent Rooftop', meta: '1 Poultry, EC2R 8EJ', blurb: 'Rooftop garden cocktail bar beside Bank Tube — views over the Lloyd\'s Building and City skyscrapers.' }
    ],
    cafes: [
      { name: 'Host Café (St Mary Aldermary)', meta: 'Watling St, EC4M 9BW', blurb: 'A specialty coffee shop set inside a 17th-century Wren church — the most dramatic café setting in London.' },
      { name: 'Workshop Coffee Clerkenwell', meta: '27 Clerkenwell Rd, EC1M 5RN', blurb: 'Flagship roastery of one of London\'s most influential specialty coffee companies.' },
      { name: 'Café Below (St Mary-le-Bow)', meta: 'Cheapside, EC2V 6AU', blurb: 'Beneath the Bow bells in the Norman crypt — proper hot lunches, cash-only. City-worker classic.' }
    ],
    shopping: [
      '<strong>Leadenhall Market</strong> — independent jewellers, wine merchants, the Lamb Tavern. Closed weekends.',
      '<strong>One New Change</strong> — shopping centre directly beside St Paul\'s with a free public rooftop viewing terrace (6th floor).',
      '<strong>Daunt Books Cheapside</strong> — City branch of the Edwardian travel bookshop.',
      '<strong>London Silver Vaults</strong> (53-64 Chancery Lane) — the world\'s largest retail antique silver collection, 30+ dealers in underground vaults.',
      '<strong>Royal Exchange</strong> — luxury shopping arcade inside the 19th-century building opposite Bank.'
    ],
    tube: [
      { name: 'Bank / Monument', lines: 'Central, Northern, Waterloo & City, District, Circle, DLR', note: 'the Square Mile\'s central crossroads' },
      { name: 'St Paul\'s', lines: 'Central', note: 'cathedral side' },
      { name: 'Liverpool Street', lines: 'Central, Metropolitan, Circle, Hammersmith & City, Elizabeth', note: 'north-east corner' },
      { name: 'Tower Hill', lines: 'District, Circle', note: 'Tower of London; connects to Tower Gateway DLR' }
    ],
    tips: [
      'The City is half-empty on weekends — perfect for photography of Leadenhall Market and Lloyd\'s of London without crowds.',
      'The Horizon 22 viewing gallery (58th floor, 22 Bishopsgate) is free — book 2 weeks ahead.',
      'Free lunchtime concerts at St Martin-in-the-Fields, St Lawrence Jewry, and St Mary-le-Bow most weekdays.',
      'Sunday morning Evensong at St Paul\'s (17:00 actually) is free — no cathedral entry fee required.',
      'Open House London (September) opens City skyscrapers to the public for free — the Gherkin, Cheesegrater, and Lloyd\'s are the standouts.'
    ]
  },
  {
    name: 'Chelsea',
    slug: 'chelsea',
    meta: 'The complete guide to Chelsea, London. King\'s Road, Chelsea Physic Garden, Saatchi Gallery, boutique shopping, and Chelsea Flower Show.',
    schemaDesc: 'Chelsea is an elegant riverside neighbourhood of Georgian architecture, boutique shops, and the world\'s most famous flower show.',
    touristType: ['Shoppers', 'Architecture Fans', 'Foodies', 'Garden Lovers'],
    geo: { lat: 51.4875, lng: -0.1687 },
    hero: 'King\'s Road glamour, Chelsea Physic Garden serenity, and the annual Flower Show — an elegant riverside neighbourhood',
    overview: {
      body: [
        'Chelsea stretches along the north bank of the Thames between Battersea Bridge and Sloane Square. The King\'s Road runs through it — once the Swinging-60s rebellion street, now upmarket shopping and the World\'s End punk landmark.',
        'Beyond the Road: the Chelsea Physic Garden (London\'s oldest botanic garden), the Saatchi Gallery, the Royal Hospital Chelsea (Flower Show venue), Sloane Square, and some of London\'s loveliest Georgian terraces.'
      ],
      vibe: 'Polished and traditional. Sloane Rangers, art-world insiders, quiet old money. Café culture at brunch; bar culture at 7pm.',
      bestFor: 'Shoppers, garden lovers, architecture fans, anyone who wants London at its most decorous.'
    },
    attractions: [
      { name: 'Chelsea Physic Garden', meta: '66 Royal Hospital Rd, SW3 4HS', blurb: 'London\'s oldest botanic garden (1673) — 5,000 medicinal, rare, and edible plants behind walled-in Chelsea streets. Closed winters.' },
      { name: 'Saatchi Gallery', meta: 'Duke of York\'s HQ, King\'s Rd, SW3 4RY', blurb: 'Charles Saatchi\'s contemporary art gallery — free entry, provocative blockbuster shows (Pangaea, From Selfie to Self-Expression).' },
      { name: 'Royal Hospital Chelsea', meta: 'Royal Hospital Rd, SW3 4SR', blurb: 'Christopher Wren\'s 1692 home for retired soldiers — the scarlet-coated Chelsea Pensioners. Grounds host the Chelsea Flower Show (late May).' },
      { name: 'Chelsea Old Church', meta: '64 Cheyne Walk, SW3 5LT', blurb: 'Thomas More\'s private chapel survives from 1528 — one of very few pre-Reformation fragments in London. Bombed in the Blitz; rebuilt carefully.' },
      { name: 'National Army Museum', meta: 'Royal Hospital Rd, SW3 4HT', blurb: 'Free museum covering 400 years of British military history. Excellent family galleries.' }
    ],
    restaurants: [
      { name: 'Restaurant Gordon Ramsay', meta: '68 Royal Hospital Rd, SW3 4HP · French · $$$$', blurb: 'Gordon Ramsay\'s three-Michelin-starred flagship (1998). Tasting menu £225. Dress code enforced.' },
      { name: 'The Harwood Arms', meta: 'Walham Grove, SW6 1QP · British · $$$', blurb: 'Britain\'s only Michelin-starred pub — seasonal British, game-forward menu. Book 3 weeks ahead.' },
      { name: 'Medlar', meta: '438 King\'s Rd, SW10 0LJ · French · $$$$', blurb: 'Former Michelin-starred Chelsea neighbourhood restaurant — refined French, set lunch £40.' },
      { name: 'Bluebird', meta: '350 King\'s Rd, SW3 5UU · European · $$$', blurb: 'Terence Conran\'s classic — the Art Deco-themed courtyard restaurant on King\'s Road. Long-running, still buzzy.' },
      { name: 'Colbert', meta: '50-52 Sloane Square, SW1W 8AX · French · $$$', blurb: 'Jeremy King\'s Parisian brasserie — red leather banquettes, steak-frites, oeufs en cocotte. Early-evening set menu £25.' }
    ],
    bars: [
      { name: 'The Cross Keys', meta: '1 Lawrence St, SW3 5NB', blurb: 'Chelsea\'s oldest pub (1712) — Whistler, Turner, and Dylan Thomas drank here. Now a sharp gastropub.' },
      { name: 'The Builder\'s Arms', meta: '13 Britten St, SW3 3TY', blurb: 'Gastropub with fireplaces and a Sunday roast institution. Tucked off King\'s Road — a locals\' find.' },
      { name: 'The Cadogan Arms', meta: '298 King\'s Rd, SW3 5UG', blurb: 'Classic Chelsea pub with a reputation for its Sunday roast and smart upstairs dining room.' },
      { name: 'The Bleeding Heart (Chelsea branch)', meta: '27 Ebury St, SW1W 0LU', blurb: 'Intimate French-themed wine bar and bistro in a mews off Sloane Square.' },
      { name: 'The Orange', meta: '37 Pimlico Rd, SW1W 8NE', blurb: 'Pimlico-Chelsea border — Georgian pub and small hotel with an excellent gastropub menu.' }
    ],
    cafes: [
      { name: 'Peggy Porschen Chelsea', meta: '219 King\'s Rd, SW3 5EJ', blurb: 'The Insta-famous pink cake parlour. Floral entrance, cupcakes, afternoon tea — pure photo-op.' },
      { name: 'Le Pain Quotidien Chelsea', meta: '343 King\'s Rd, SW3 5ES', blurb: 'Communal wooden tables, organic breads, honest Franco-Belgian brunch.' },
      { name: 'Beatrix', meta: '8 Lots Road, SW10 0RF', blurb: 'Airy Lots Road bistro-café with fresh seasonal breakfasts, natural wines, and Chelsea-art-crowd regulars.' }
    ],
    shopping: [
      '<strong>King\'s Road</strong> — the Swinging Sixties high street. Mixed chains and high-end boutiques; the west end (World\'s End) retains Vivienne Westwood\'s original shop.',
      '<strong>Duke of York Square</strong> — pedestrianised contemporary retail plaza anchored by Saatchi Gallery. Saturday farmers\' market.',
      '<strong>Pavilion Road</strong> — a charming mews of independent food shops: Fin & Flounder fishmonger, The Butchery, Natoora vegetables.',
      '<strong>Sloane Street</strong> — the luxury axis: Louis Vuitton, Chanel, Valentino, Tom Ford, all in a five-minute stroll.',
      '<strong>Peter Jones</strong> — department store on Sloane Square, John Lewis\'s upmarket sister. Brilliant for gifts.',
      '<strong>John Sandoe Books</strong> (10 Blacklands Terrace) — an indie three-floor bookshop, hand-curated for 60 years.'
    ],
    tube: [
      { name: 'Sloane Square', lines: 'District, Circle', note: 'the civic gateway — Royal Court Theatre opposite' },
      { name: 'South Kensington', lines: 'District, Circle, Piccadilly', note: 'north-east — museums quarter adjacent' },
      { name: 'Earl\'s Court', lines: 'District, Piccadilly', note: 'west side, closer to World\'s End and Chelsea FC' }
    ],
    tips: [
      'The Chelsea Flower Show (late May) sells out months ahead — buy RHS membership for the Monday preview day.',
      'Walk the Thames Path from Chelsea Bridge to Battersea Bridge at dusk — the Albert Bridge lights up pink and yellow at sunset.',
      'The King\'s Road Sunday brunch scene is more relaxed (and bookable) than central London — try Bluebird or Ivy Chelsea Garden.',
      'Chelsea Physic Garden is closed weekdays in winter — plan accordingly.',
      'Duke of York Square Farmers\' Market (Saturdays) is one of central London\'s best — artisan cheese, bread, pastries.'
    ]
  },
  {
    name: 'Clerkenwell',
    slug: 'clerkenwell',
    meta: 'The complete guide to Clerkenwell. Design district, Exmouth Market, Charterhouse, Smithfield, Farringdon restaurants, and London\'s most respected food-and-design quarter.',
    schemaDesc: 'Clerkenwell is London\'s design district — a medieval quarter of converted factories, artisan restaurants, and the country\'s densest concentration of architects and designers.',
    touristType: ['Foodies', 'Design Fans', 'Architecture Buffs', 'History Lovers'],
    geo: { lat: 51.5225, lng: -0.1055 },
    hero: 'London\'s design capital — medieval monastery, Victorian factories, Exmouth Market, and the country\'s most concentrated foodie district',
    overview: {
      body: [
        'Clerkenwell sits just north of the City — a medieval religious quarter (Clerk\'s Well, Charterhouse, Priory of St John) converted through the industrial era into a Victorian printing-and-clockmaking district, now reconverted into the country\'s densest design/architecture/publishing quarter.',
        'Sandwiched between Smithfield Market and Exmouth Market, it\'s a foodie magnet — St. JOHN, Quality Chop House, Morito, Moro, Sessions Arts Club, and a rotating cast of London\'s most ambitious new restaurants.'
      ],
      vibe: 'Creative, design-forward, confident. Suits mixing with architects, publishers, and chefs. Evenings buzzy.',
      bestFor: 'Foodies, design lovers, architecture fans, people who want a substantial neighbourhood experience away from tourist crowds.'
    },
    attractions: [
      { name: 'Charterhouse', meta: 'Charterhouse Square, EC1M 6AN', blurb: 'Medieval monastery turned Tudor mansion turned almshouse — still housing 40 "brothers". Guided tours only (£15), book ahead.' },
      { name: 'Museum of the Order of St John', meta: 'St John\'s Gate, St John\'s Lane, EC1M 4DA', blurb: 'The only surviving part of the 12th-century Priory of St John. Free museum on the Crusader Knights Hospitaller and the origin of St John Ambulance.' },
      { name: 'Marx Memorial Library', meta: '37a Clerkenwell Green, EC1R 0DU', blurb: 'Where Lenin edited Iskra from 1902-03 — a tiny radical history museum and library, tours available.' },
      { name: 'Smithfield Market', meta: 'Grand Ave, EC1A 9PS', blurb: 'The 800-year-old meat market, operating nightly. Vast Victorian iron-and-glass structure best seen 3am-7am. Due to close permanently 2027.' },
      { name: 'Sadler\'s Wells', meta: 'Rosebery Ave, EC1R 4TN', blurb: 'The world\'s leading dance house — contemporary, ballet, flamenco, hip-hop, on a site where a spring-fed theatre first opened in 1683.' }
    ],
    restaurants: [
      { name: 'St. JOHN Smithfield', meta: '26 St John St, EC1M 4AY · British · $$$$', blurb: 'Fergus Henderson\'s nose-to-tail British restaurant (1994) — the birthplace of modern British cooking. Bone marrow and parsley salad is legendary.' },
      { name: 'Quality Chop House', meta: '94 Farringdon Rd, EC1R 3EA · British · $$$$', blurb: 'A 1869 working-class chop house, Grade II-listed, now seasonal British in the original wooden booths. Quality Wines wine-shop next door serves £14 lunches.' },
      { name: 'Moro', meta: '34-36 Exmouth Market, EC1R 4QE · Spanish · $$$', blurb: 'The Clerkenwell restaurant that invented Moorish-Mediterranean cooking for London (1997). Sister Morito next door is tapas-focused and walk-in friendly.' },
      { name: 'Sessions Arts Club', meta: '24 Clerkenwell Green, EC1R 0NA · European · $$$$', blurb: 'A former courtroom above Old Sessions House — faded grandeur, candle-lit, a Florian-Nouveau interior. Book weeks ahead.' },
      { name: 'The Modern Pantry', meta: '47-48 St John\'s Square, EC1V 4JJ · Fusion · $$$', blurb: 'Anna Hansen\'s Kiwi-fusion all-day café. Sugar-cured prawn omelette is signature.' }
    ],
    bars: [
      { name: 'The Jerusalem Tavern', meta: '55 Britton St, EC1M 5UQ', blurb: 'A 1720 gem — St Peter\'s Brewery\'s tiny tap, feels like a time capsule. Squeeze onto a bench.' },
      { name: 'The Betsey Trotwood', meta: '56 Farringdon Rd, EC1R 3BL', blurb: 'Victorian pub with basement-gig singer-songwriter scene. Gigs £5-10 most nights.' },
      { name: 'Fox & Anchor', meta: '115 Charterhouse St, EC1M 6AA', blurb: 'Smithfield pub open from 7am for "market breakfasts" — the City Boy breakfast includes half a pint of Guinness.' },
      { name: 'Oriole', meta: 'East Poultry Ave, Smithfield, EC1A 9LH', blurb: 'Underground cocktail bar from the Nightjar team. Live jazz nightly, global cocktail menu.' },
      { name: 'Workshop (Three Crowns)', meta: '8 East Rd, N1 6AD', blurb: 'Hoxton-border neighbourhood pub-hotel — excellent craft beer range and a Sunday roast beloved of Clerkenwell locals.' }
    ],
    cafes: [
      { name: 'Workshop Coffee Clerkenwell', meta: '27 Clerkenwell Rd, EC1M 5RN', blurb: 'Flagship roastery of one of London\'s most influential specialty coffee companies. Rotating single-origin espresso, filter flights.' },
      { name: 'Caravan Exmouth Market', meta: '11-13 Exmouth Market, EC1R 4QD', blurb: 'Original Caravan — a weekend brunch queue, New Zealand-inspired menu, in-house coffee roastery. Cornbread with maple butter is the classic.' },
      { name: 'Prufrock Coffee', meta: '23-25 Leather Ln, EC1N 7TE', blurb: 'A Gwilym Davies-founded Chancery Lane specialty coffee bar. Regular brewing classes for coffee nerds.' }
    ],
    shopping: [
      '<strong>Exmouth Market</strong> — pedestrianised street of independent shops and restaurants. Farmers\' market on Saturdays.',
      '<strong>Leather Lane Market</strong> — a weekday food-truck and clothing market popular with Clerkenwell office workers.',
      '<strong>Family Tree</strong> (53 Exmouth Market) — jewellery and homewares boutique showcasing young British makers.',
      '<strong>Clerkenwell Design Week</strong> (May) — the UK\'s biggest design festival opens showrooms across the district.',
      '<strong>Magma Bookshop</strong> (117-119 Clerkenwell Rd) — specialist design, architecture, and graphic arts bookshop.',
      '<strong>Ottolenghi Islington</strong> (short walk north) — the original deli of Yotam Ottolenghi, with jewel-like salads and cakes.'
    ],
    tube: [
      { name: 'Farringdon', lines: 'Circle, Metropolitan, Hammersmith & City, Elizabeth', note: 'the Clerkenwell gateway — also Thameslink mainline' },
      { name: 'Barbican', lines: 'Circle, Metropolitan, Hammersmith & City', note: 'east side — adjacent to Barbican and Museum of London' },
      { name: 'Angel', lines: 'Northern', note: 'north side — Sadler\'s Wells five-minute walk' },
      { name: 'Chancery Lane', lines: 'Central', note: 'south side — Leather Lane nearby' }
    ],
    tips: [
      'Clerkenwell Design Week (May) opens 300+ design showrooms across the district — mostly free.',
      'St. JOHN is easier to book for lunch than dinner; bakery-café on site sells their famous Eccles cakes.',
      'Postman\'s Park (Aldersgate, just south) is a beautiful hidden garden with the Watts Memorial — plaques commemorating ordinary Londoners who died saving others.',
      'The secret Medieval Hall at Charterhouse is visible only on guided tours — book weeks ahead.',
      'Exmouth Market is at its best on weekday lunchtimes or Saturday morning farmers\' market.'
    ]
  },
  {
    name: 'Bankside',
    slug: 'bankside',
    meta: 'The complete guide to Bankside, London. Tate Modern, Shakespeare\'s Globe, Borough Market, Millennium Bridge, and the South Bank\'s cultural riverside.',
    schemaDesc: 'Bankside is London\'s cultural riverside — home to Tate Modern, Shakespeare\'s Globe, Borough Market, and the Thames Path\'s best stretch.',
    touristType: ['Culture Seekers', 'Foodies', 'Photographers', 'First-Timers'],
    geo: { lat: 51.5076, lng: -0.0994 },
    hero: 'Tate Modern, Shakespeare\'s Globe, and Borough Market — the Thames\'s most culturally packed half-mile',
    overview: {
      body: [
        'Bankside is the stretch of the south bank of the Thames between Blackfriars Bridge and London Bridge — once a notorious theatre and red-light district during Shakespeare\'s time, now the city\'s most culturally dense riverside.',
        'The core: Tate Modern (in the old Bankside Power Station), Shakespeare\'s Globe (a 1997 reconstruction), Borough Market (1,000 years old), the Millennium Bridge to St Paul\'s, and a direct Thames-Path walk to Tower Bridge.'
      ],
      vibe: 'Buzzing and tourist-happy by day; surprisingly quiet Sunday evenings; a Londoners-favourite walk on summer Fridays.',
      bestFor: 'First-timers, culture seekers, foodies, photographers, families with kids.'
    },
    attractions: [
      { name: 'Tate Modern', meta: 'Bankside, SE1 9TG', blurb: 'The UK\'s national gallery of modern and contemporary art, in a former power station. Free entry. The Turbine Hall\'s rotating installations are iconic.' },
      { name: 'Shakespeare\'s Globe', meta: '21 New Globe Walk, SE1 9DT', blurb: '1997 reconstruction of the 1599 theatre — authentic open-air staging, £5 "groundling" standing tickets, season April-October. Guided tours in winter.' },
      { name: 'Borough Market', meta: '8 Southwark St, SE1 1TL', blurb: 'One of London\'s oldest food markets (13th century). Weekends busiest; weekdays calmer. 100+ stalls and a legendary food scene around the edges.' },
      { name: 'Millennium Bridge', meta: 'Thames Embankment, SE1 9JE', blurb: 'The elegant steel-cable footbridge linking St Paul\'s to Tate Modern — London\'s first new Thames crossing in over a century. Famously wobbled on opening.' },
      { name: 'The Clink Prison Museum', meta: '1 Clink St, SE1 9DG', blurb: 'Remnants of England\'s oldest prison (1144-1780) — on the site, atmospheric, good for teenagers.' }
    ],
    restaurants: [
      { name: 'Padella', meta: '6 Southwark St, SE1 1TQ · Italian · $$', blurb: 'Hand-made pasta at incredibly reasonable prices. The pappardelle with 8-hour beef shin ragu is extraordinary. No reservations — queue.' },
      { name: 'Hawksmoor Borough', meta: '16 Winchester Walk, SE1 9AQ · British · $$$$', blurb: 'Legendary British steakhouse in a vast glass-roofed Victorian room. Express menu £30.' },
      { name: 'Rambutan', meta: '10 Stoney St, SE1 9AD · Sri Lankan · $$$', blurb: 'Cynthia Shanmugalingam\'s modern Sri Lankan — hot-pink booth seats, banana-leaf plates, ambitious flavours.' },
      { name: 'Arabica Bar & Kitchen', meta: 'Rochester Walk, SE1 9AF · Middle Eastern · $$$', blurb: 'Borough Market meze restaurant — mezze, grills, all day. Great for groups.' },
      { name: 'Roast', meta: 'The Floral Hall, SE1 1TL · British · $$$', blurb: 'Directly above Borough Market — glass-walled dining room, British roast trolley, tourist-friendly Sunday lunch.' }
    ],
    bars: [
      { name: 'The Anchor Bankside', meta: '34 Park St, SE1 9EF', blurb: 'Grade II-listed Thames-side pub — Shakespeare drank here, Pepys escaped the Great Fire here. Riverside terrace is the summer draw.' },
      { name: 'The George Inn', meta: '77 Borough High St, SE1 1NH', blurb: 'London\'s last surviving galleried coaching inn (1677) — Dickens drank here, the National Trust preserves it. Atmospheric cobbled courtyard.' },
      { name: 'Menier Chocolate Factory Bar', meta: '53-55 Southwark St, SE1 1RU', blurb: 'Former cocoa warehouse\'s theatre bar — excellent cocktails, dinner-and-show packages.' },
      { name: 'Aqua Shard', meta: '31 St Thomas St, SE1 9RY', blurb: 'Level 31 of the Shard — book just the bar for panoramic skyline views without the restaurant spend.' },
      { name: 'The Rake', meta: '14a Winchester Walk, SE1 9AG', blurb: 'Borough Market craft beer pioneer — 12+ taps, tiny bench-seated snug, expert staff.' }
    ],
    cafes: [
      { name: 'Monmouth Coffee (Borough)', meta: '2 Park St, SE1 9AB', blurb: 'London\'s original specialty coffee roaster. Legendary. Queues at weekends but move fast.' },
      { name: 'Bread Ahead Borough', meta: '86 Borough High St, SE1 1LL', blurb: 'Market bakery famous for doughnuts — vanilla-custard classics, bread classes upstairs.' },
      { name: 'Fernandez & Wells Somerset House', meta: 'Strand, WC2R 1LA', blurb: 'Technically north of the river but the nearest quality café to Bankside. Pulled-pork sandwich is a cult pick.' }
    ],
    shopping: [
      '<strong>Borough Market</strong> — food market, 100+ stalls. Saturdays are the biggest day; Thursdays calmer.',
      '<strong>Tate Modern Shop</strong> — excellent contemporary art books, prints, design objects.',
      '<strong>Vinegar Yard</strong> — post-industrial street-food and events space with an antiques flea market on Saturdays and Sundays.',
      '<strong>Maltby Street Market</strong> (10-min walk east) — the food-lovers\' alternative to Borough, Saturdays only.',
      '<strong>Utobeer</strong> — Borough Market specialist craft-beer stall with 400+ beers to take home.'
    ],
    tube: [
      { name: 'London Bridge', lines: 'Northern, Jubilee', note: 'east side — Borough Market-adjacent; also mainline' },
      { name: 'Southwark', lines: 'Jubilee', note: 'centre — Tate Modern and Globe closest' },
      { name: 'Blackfriars', lines: 'District, Circle', note: 'north-west — also a mainline station on the Thames itself' },
      { name: 'Waterloo', lines: 'Bakerloo, Northern, Jubilee, Waterloo & City', note: 'west side — 15-min walk along the Thames Path' }
    ],
    tips: [
      'Tate Modern\'s Level 10 viewing gallery is free — sunset over St Paul\'s is spectacular.',
      'Globe standing (groundling) tickets are £5 — arrive early, but the 2.5-hour stand is authentic.',
      'Borough Market is Thursday-Saturday (10am-5pm); early Saturday is busiest. Tuesday-Wednesday stalls are limited.',
      'Walk the Thames Path from Bankside to Tower Bridge at sunset — 20 minutes, spectacular views.',
      'Vinegar Yard\'s rotating street-food traders open weekend evenings — a less touristy alternative to Borough.'
    ]
  },
  {
    name: 'Bloomsbury',
    slug: 'bloomsbury',
    meta: 'The complete guide to Bloomsbury, London. British Museum, British Library, garden squares, Bloomsbury Group heritage, and London\'s intellectual heartland.',
    schemaDesc: 'Bloomsbury is London\'s intellectual quarter — the British Museum, British Library, UCL, garden squares, and the home of the Bloomsbury Group.',
    touristType: ['History Buffs', 'Literary Travellers', 'Architecture Fans', 'Culture Seekers'],
    geo: { lat: 51.5214, lng: -0.1283 },
    hero: 'British Museum, British Library, and the garden squares of the Bloomsbury Group — London\'s intellectual heartland',
    overview: {
      body: [
        'Bloomsbury sits between Oxford Street and King\'s Cross — a grid of Georgian garden squares and streets developed by the Bedford Estate in the 18th and 19th centuries. The area is named after the Bloomsbury Group (Virginia Woolf, Keynes, the Stracheys) who lived here in the early 20th century.',
        'Its three crown jewels: the British Museum (the world\'s oldest public museum), the British Library (the UK\'s national library), and UCL (one of Britain\'s top research universities). In between: garden squares, literary pubs, and a village feel.'
      ],
      vibe: 'Intellectual, unhurried, green. Academics and tourists weave through the same streets.',
      bestFor: 'Readers, history buffs, architecture fans, anyone who wants a slower, more thoughtful London experience.'
    },
    attractions: [
      { name: 'British Museum', meta: 'Great Russell St, WC1B 3DG', blurb: 'One of the world\'s greatest museums — 8 million works spanning human history. Free entry. The Rosetta Stone and Egyptian mummies are the star attractions.' },
      { name: 'British Library Treasures Gallery', meta: '96 Euston Rd, NW1 2DB', blurb: 'Free exhibition — the Magna Carta, Beatles lyric sheets, Shakespeare First Folios, Jane Austen\'s writing desk. Extraordinary.' },
      { name: 'Charles Dickens Museum', meta: '48 Doughty St, WC1N 2LX', blurb: 'The only Dickens home open to the public — where he wrote "Oliver Twist" and "Nicholas Nickleby" 1837-1839.' },
      { name: 'Foundling Museum', meta: '40 Brunswick Sq, WC1N 1AZ', blurb: 'The story of London\'s first children\'s home — art donated by Hogarth and Handel, tokens left by destitute mothers in the 1700s.' },
      { name: 'Wellcome Collection', meta: '183 Euston Rd, NW1 2BE', blurb: 'Free museum of "medicine, life and art" — Napoleon\'s toothbrush, Darwin\'s walking stick, Freud\'s couch, contemporary exhibitions.' }
    ],
    restaurants: [
      { name: 'Noble Rot Bloomsbury', meta: '51 Lamb\'s Conduit St, WC1N 3NB · European · $$$', blurb: 'Smart wine-focused restaurant — a wine list that reads like a collection. Excellent modern British cooking.' },
      { name: 'Ciao Bella', meta: '86-90 Lamb\'s Conduit St, WC1N 3LZ · Italian · $$', blurb: 'Candlelit cult trattoria since 1982 — piano nightly, classic Italian menu, tables close together. Big tables for groups.' },
      { name: 'Otto\'s French Restaurant', meta: '182 Gray\'s Inn Rd, WC1X 8EW · French · $$$', blurb: 'The only London restaurant still serving canard à la presse (pressed duck) tableside. Theatrical. Order 24h ahead.' },
      { name: 'Hakkasan Hanway Place', meta: '8 Hanway Pl, W1T 1HD · Chinese · $$$$', blurb: 'The original 2001 Hakkasan — Michelin-starred Cantonese in a moody-lit basement. Dim sum lunch more affordable.' },
      { name: 'Bao Fitzrovia', meta: '31 Windmill St, W1T 2JN · Taiwanese · $$', blurb: 'Taiwanese gua bao in a stylish corner — bookable, with the full menu and downstairs karaoke rooms.' }
    ],
    bars: [
      { name: 'The Lamb', meta: '94 Lamb\'s Conduit St, WC1N 3LZ', blurb: 'Victorian stained-glass pub with etched-glass snob-screens on the bar. Dickens mentioned it in "Barnaby Rudge".' },
      { name: 'The Museum Tavern', meta: '49 Great Russell St, WC1B 3BA', blurb: 'Directly opposite the British Museum — Karl Marx drank here while writing Das Kapital across the road.' },
      { name: 'The Princess Louise', meta: '208 High Holborn, WC1V 7EP', blurb: 'Astonishing 1872 Victorian gin palace — etched mirrors, ornate tilework, horseshoe bar. Cheapest pub in central London (Sam Smith\'s prices).' },
      { name: 'The Seven Stars', meta: '53 Carey St, WC2A 2JB', blurb: 'One of the oldest pubs in London (1602), survived the Great Fire. Tiny, opinionated landlady, superb cask ales.' },
      { name: 'The Perseverance', meta: '63 Lamb\'s Conduit St, WC1N 3NB', blurb: 'Gastropub on Bloomsbury\'s best high street. Outstanding upstairs dining room; excellent Sunday roast.' }
    ],
    cafes: [
      { name: 'Store Street Espresso', meta: '40 Store St, WC1E 7DB', blurb: 'Bloomsbury student-favourite specialty coffee. Long wood benches, calm room, great for laptop work.' },
      { name: 'The Cake Shop at London Review Bookshop', meta: '14-16 Bury Pl, WC1A 2JL', blurb: 'Tiny Bloomsbury café next to the London Review Bookshop. Some of London\'s best cakes (try the lamingtons).' },
      { name: 'Fortitude Bakehouse', meta: '35 Colonnade, WC1N 1JA', blurb: 'Sourdough, flaky pastries, filter coffee, quiet back-room — a Bloomsbury hidden gem.' }
    ],
    shopping: [
      '<strong>Lamb\'s Conduit Street</strong> — independent-shop paradise: Persephone Books, The Lamb pub, Ciao Bella, and several bespoke menswear specialists.',
      '<strong>London Review Bookshop</strong> (14-16 Bury Pl) — the bookshop of the London Review of Books, razor-sharp curation.',
      '<strong>Persephone Books</strong> (59 Lamb\'s Conduit St) — publisher and shop selling rediscovered 20th-century women writers in signature dove-grey covers.',
      '<strong>Gay\'s the Word</strong> (66 Marchmont St) — the UK\'s oldest LGBTQ+ bookshop (1979).',
      '<strong>The British Museum Shop</strong> — broad, beautifully curated. Egyptian reproductions are classic gifts.',
      '<strong>Brunswick Centre</strong> — a Brutalist shopping-and-housing complex with a Curzon Bloomsbury cinema and Waitrose.'
    ],
    tube: [
      { name: 'Russell Square', lines: 'Piccadilly', note: 'at the heart of Bloomsbury; 3-min walk to British Museum' },
      { name: 'Holborn', lines: 'Central, Piccadilly', note: 'south side — Lincoln\'s Inn Fields nearby' },
      { name: 'Tottenham Court Road', lines: 'Central, Northern, Elizabeth', note: 'west side — British Museum nearby' },
      { name: 'Euston', lines: 'Northern, Victoria', note: 'north side; also mainline station' }
    ],
    tips: [
      'The British Museum is free and usually quietest on weekday mornings opening (10am) — focus on Egypt, the Rosetta Stone, and the Enlightenment Gallery.',
      'The British Library Treasures Gallery (free) rotates Beatles manuscripts, Beethoven sketches, and Gutenberg Bibles — 30 minutes well spent.',
      'Garden squares — Russell, Bedford, Bloomsbury, Gordon, Tavistock — are free to walk through and were the setting for the Bloomsbury Group.',
      'UCL\'s "Auto-Icon" (the preserved body of philosopher Jeremy Bentham, in the Student Centre cabinet) is free to visit and genuinely unusual.',
      'Skip the Covent Garden tourist restaurants — walk 10 minutes north to Lamb\'s Conduit Street for a calmer, better meal.'
    ]
  },
  {
    name: 'Canary Wharf',
    slug: 'canary-wharf',
    meta: 'The complete guide to Canary Wharf, London. Docklands skyline, Museum of London Docklands, restaurants, rooftop gardens, and post-industrial waterside.',
    schemaDesc: 'Canary Wharf is London\'s modern skyline — a cluster of skyscrapers on the old West India Docks, with restaurants, riverside parks, and the Docklands\' industrial heritage.',
    touristType: ['Architecture Fans', 'Business Visitors', 'Families', 'Photographers'],
    geo: { lat: 51.5054, lng: -0.0235 },
    hero: 'Docklands skyline, the West India Docks, and the modern London that tourists miss — high finance meets riverside parkland',
    overview: {
      body: [
        'Canary Wharf sits on the Isle of Dogs — a Thames peninsula where the West India Docks operated 1802-1980. In the 1990s the old warehouses and docks became the centre of a new business district: 18 million sq ft of offices, 40+ skyscrapers, 400 shops, and a waterside public realm that\'s actually lovely.',
        'For tourists: the Museum of London Docklands (free, in a Georgian sugar warehouse), the cable car across the Thames, the Crossrail Place roof garden, and photography of London\'s most ambitious modern skyline.'
      ],
      vibe: 'Glass-and-steel professional by day; surprisingly lively for drinks after 5pm; quiet weekends.',
      bestFor: 'Architecture fans, photographers (especially at dusk), families (cable car, Mudchute Farm), business visitors.'
    },
    attractions: [
      { name: 'Museum of London Docklands', meta: 'No 1 Warehouse, West India Quay, E14 4AL', blurb: 'Free museum of the Thames, the port, and the docks — inside a restored Georgian sugar warehouse. "Sailortown" reconstruction is memorable.' },
      { name: 'IFS Cloud Cable Car', meta: 'Edmund Halley Way, SE10 0FR', blurb: 'A 1.1km cable car across the Thames from Greenwich Peninsula to the Royal Docks — 90 metres at the highest point.' },
      { name: 'Crossrail Place Roof Garden', meta: 'Crossrail Place, E14 5AR', blurb: 'Foster + Partners\' timber-latticed rooftop park — divided into eastern and western plant hemispheres, suspended over the Crossrail station.' },
      { name: 'Mudchute Park and Farm', meta: 'Pier St, E14 3HP', blurb: 'A 32-acre urban farm in the middle of the Isle of Dogs — free, family-friendly, with London\'s skyline as a backdrop.' },
      { name: 'Canary Wharf Public Art Trail', meta: 'Across the Canary Wharf estate', blurb: 'Free self-guided walk of 70+ sculptures by Lynn Chadwick, Henry Moore, Pierre Vivant, and others. Maps at Reception Centre.' }
    ],
    restaurants: [
      { name: 'Dishoom Canary Wharf', meta: '22 Hertsmere Rd, E14 4ED · Indian · $$', blurb: 'The airy Canary Wharf Dishoom — less-queued than central branches. Breakfast is the move.' },
      { name: 'Boisdale of Canary Wharf', meta: 'Cabot Pl, E14 4QT · Scottish · $$$$', blurb: 'Scottish restaurant specialising in steaks, oysters, and whisky — live jazz nightly in the sprawling upstairs lounge.' },
      { name: 'Roka Canary Wharf', meta: 'Level 1, 40 Canada Square, E14 5FW · Japanese · $$$$', blurb: 'The Canary Wharf Roka — robatayaki grill, sushi, glamorous atmosphere. Set lunch £35.' },
      { name: 'Iberica Canary Wharf', meta: 'Cabot Square, E14 4QT · Spanish · $$$', blurb: 'Airy Spanish restaurant in the Financial Times building — jamón counter, great tapas, weekend brunch.' },
      { name: 'Plateau', meta: '4th Floor, Canada Place, E14 5ER · French · $$$$', blurb: 'Glass-walled fourth-floor French restaurant with panoramic skyline views — a Canary Wharf fixture for business lunches.' }
    ],
    bars: [
      { name: 'The Gun', meta: '27 Coldharbour, E14 9NS', blurb: 'A smart Georgian riverside pub in the Isle of Dogs — Lord Nelson and Lady Hamilton used to meet here. Summer terrace with O2 views.' },
      { name: 'The Jamaica Wine House', meta: 'Wine Office Ct, City (short DLR ride)', blurb: 'Historic City pub — worth the short trip for a drink before heading back to Canary Wharf.' },
      { name: 'Sipping House Canary Wharf', meta: 'Park Pavilion, 40 Canada Square, E14 5FW', blurb: 'Garden pavilion bar with outdoor seating — excellent cocktails, lovely summer terrace.' },
      { name: 'Humble Grape Canary Wharf', meta: '1 Westferry Circus, E14 4HD', blurb: 'Wine bar-restaurant with 400+ wines and a serious but approachable list. Retail+£15 corkage.' },
      { name: 'The Pepper Saint Ontiod', meta: '27 Marsh Wall, E14 9SH', blurb: 'Quirky-themed cocktail bar in the middle of the Canary Wharf estate — loud, lively, popular with the suit crowd.' }
    ],
    cafes: [
      { name: 'Watch House Canary Wharf', meta: 'Crossrail Place, E14 5AR', blurb: 'Specialty coffee and cold brew — reliable morning stop.' },
      { name: 'The Breakfast Club Canary Wharf', meta: '34 Westferry Circus, E14 8RR', blurb: 'All-day American-British brunch cafe — pancake stacks, huevos rancheros, Canary Wharf weekend favourite.' },
      { name: 'Kongs', meta: 'Cabot Square, E14 4QQ', blurb: 'Hidden under Cabot Square — Indonesian-Malaysian flavours for breakfast and lunch, a Canary Wharf secret.' }
    ],
    shopping: [
      '<strong>Canary Wharf Shopping</strong> — Cabot Place, Canada Place, and Jubilee Place malls cover 320+ shops with luxury and high-street fashion.',
      '<strong>Waitrose Canary Wharf</strong> — the flagship of Waitrose\'s premium grocery.',
      '<strong>The Ritzy Gift Bar</strong> (Cabot Place) — bespoke fragrance and candle boutique.',
      '<strong>The Everyman Cinema Canary Wharf</strong> — boutique cinema with sofa seating, meals, cocktails.',
      '<strong>Canary Wharf Shopping App</strong> — click and collect across 300+ stores delivered to the Reception Centre.'
    ],
    tube: [
      { name: 'Canary Wharf', lines: 'Jubilee, Elizabeth', note: 'the hub station' },
      { name: 'Heron Quays / South Quay / Crossharbour', lines: 'DLR', note: 'Isle of Dogs south side' },
      { name: 'Canada Water', lines: 'Jubilee, Overground', note: 'two stops west — Greenwich connection' },
      { name: 'North Greenwich', lines: 'Jubilee', note: 'one stop east — O2 Arena' }
    ],
    tips: [
      'Crossrail Place Roof Garden is free — one of London\'s nicest free public spaces.',
      'The cable car is £6 one-way and best at dusk — Thames-level views of the City and Canary Wharf skylines.',
      'Weekends are quiet — restaurants that require bookings weekdays can be walked into.',
      'Canary Wharf to Greenwich via the Thames Clippers boat is one of the loveliest 15-minute commutes in London.',
      'Boisdale has live jazz nightly (free) — worth a drink even without dinner.'
    ]
  },
  {
    name: 'Hackney',
    slug: 'hackney',
    meta: 'The complete guide to Hackney, London. Broadway Market, London Fields, Victoria Park, creative east London, and the borough\'s most vibrant neighbourhoods.',
    schemaDesc: 'Hackney is East London\'s creative heartland — Broadway Market, London Fields, Victoria Park, and a concentration of independent food, art, and nightlife.',
    touristType: ['Foodies', 'Creative Travellers', 'Families', 'Music Fans'],
    geo: { lat: 51.5455, lng: -0.0553 },
    hero: 'Broadway Market, London Fields, Victoria Park — East London\'s creative, food-obsessed, post-gentrification heartland',
    overview: {
      body: [
        'Hackney (the borough and the place) stretches from Shoreditch in the south to Stamford Hill in the north. Most visitors focus on the middle: Broadway Market, London Fields, Hackney Central, Hackney Wick, and Victoria Park.',
        'Ten years ago it was affordable-and-creative; today it\'s expensive-and-creative — but the food, market, and bar scenes remain London\'s best. A single Saturday walking Broadway Market, eating at Climpson\'s Arch, drinking at Howling Hops, and wandering into a Chisenhale Gallery opening is a quintessential London day.'
      ],
      vibe: 'Young, creative, queue-happy. Saturday market energy; Sunday roasts; Friday-night DJs. Still has bite, despite the changes.',
      bestFor: 'Foodies, young travellers, music fans, families who\'ve done the main sights.'
    },
    attractions: [
      { name: 'Broadway Market', meta: 'Broadway Market, E8 4PH', blurb: 'Saturdays 9am-5pm — 100+ food, fashion, and craft stalls plus a canal-side setting. A Hackney institution.' },
      { name: 'Victoria Park', meta: 'Grove Rd, E3 5TB', blurb: 'London\'s first public park (1845). 213 acres with a lake, playgrounds, a Pavilion café, and hosts All Points East festival in summer.' },
      { name: 'Chisenhale Gallery', meta: '64 Chisenhale Rd, E3 5QZ', blurb: 'Cutting-edge commissioning gallery in a former veneer factory — many artists get their first major solo shows here.' },
      { name: 'Sutton House', meta: '2-4 Homerton High St, E9 6JQ', blurb: 'The oldest surviving house in Hackney — a Tudor red-brick mansion (1535). National Trust.' },
      { name: 'Hackney Empire', meta: '291 Mare St, E8 1EJ', blurb: 'Frank Matcham\'s 1901 variety theatre, saved and restored. London\'s best pantomime; excellent comedy and world music.' }
    ],
    restaurants: [
      { name: 'Brat', meta: 'First Floor, 4 Redchurch St, E1 6JL · Basque · $$$$', blurb: 'Basque-style open-fire cooking — Michelin-starred. The whole-roasted turbot is unforgettable.' },
      { name: 'The Marksman', meta: '254 Hackney Rd, E2 7SJ · British · $$', blurb: '19th-century exterior, Michelin Bib Gourmand-approved gastropub cooking. Pub at its finest.' },
      { name: 'Cafe Cecilia', meta: '32 Andrews Rd, E8 4RL · British · $$$', blurb: 'Max Rocha\'s airy canal-side restaurant — simple, seasonal, and hugely in demand. Book weeks ahead.' },
      { name: 'Peg', meta: '40 Morning Ln, E9 6NA · Japanese · $$$', blurb: 'Hackney yakitori and natural-wine bar — hot counter seats overlooking the grill.' },
      { name: 'Lyle\'s Shoreditch', meta: 'Tea Building, 56 Shoreditch High St, E1 6JJ · British · $$$$', blurb: 'James Lowe\'s modern-British fine-dining canteen. Lunch tasting menu £45 — one of London\'s best fine-dining bargains.' }
    ],
    bars: [
      { name: 'MOTH Club', meta: 'Old Trades Hall, Valette St, E9 6NU', blurb: 'Former British Legion hall — gold-glitter ceiling, cheap drinks, cult live gigs and DJ nights.' },
      { name: 'Satan\'s Whiskers', meta: '343 Cambridge Heath Rd, E2 9RA', blurb: 'Bethnal Green cocktail bar with a daily-changing menu written on the wall. Walk-in; hip-hop soundtrack.' },
      { name: 'Howling Hops', meta: 'Unit 9a Queens Yard, E9 5EN', blurb: 'Hackney Wick brewery and taproom — the UK\'s first tank bar, serving unfiltered beer straight from fermenters.' },
      { name: 'The Crown', meta: '223 Grove Rd, E3 5SN', blurb: 'Victoria Park gastropub on the west edge of the park — a solid Sunday roast and large beer garden.' },
      { name: 'Netil360', meta: '1 Westgate St, E8 3RL', blurb: 'Rooftop bar above Netil Market — panoramic East-London skyline, sunset DJs, casual atmosphere.' }
    ],
    cafes: [
      { name: 'E5 Bakehouse', meta: 'Arch 395, Mentmore Terrace, E8 3PH', blurb: 'London Fields bakery and café under the railway arches — sourdough-first, natural-wine bar in the evenings.' },
      { name: 'Climpson & Sons Broadway Market', meta: '67 Broadway Market, E8 4PH', blurb: 'Independent Hackney roaster and café. Saturday Broadway Market is just outside.' },
      { name: 'Pavilion Café Victoria Park', meta: 'Grove Rd, E3 5TB', blurb: 'Lake-side café in Victoria Park — classic full Englishes, dog-friendly, Hackney institution.' }
    ],
    shopping: [
      '<strong>Broadway Market (Saturdays)</strong> — the Saturday market: 100+ food, fashion, and craft stalls, plus weekly favourites Climpson\'s, E5 Bakehouse, Fin & Flounder.',
      '<strong>Netil Market (Saturdays)</strong> — a tarpaulin-covered collection of street-food and indie fashion stalls adjacent to Broadway Market.',
      '<strong>Mare Street</strong> — Hackney Central\'s high street. Burberry Factory Shop, LN-CC, and quirky independents.',
      '<strong>Wilton Way</strong> — a cluster of independent shops near London Fields: Artwords bookshop, Triangle coffee, bespoke tailors.',
      '<strong>Hackney Flea (quarterly)</strong> — a pop-up antique flea market at Stoke Newington Town Hall.',
      '<strong>Rough Trade East</strong> (short walk south) — Brick Lane record shop.'
    ],
    tube: [
      { name: 'Hackney Central', lines: 'Overground', note: 'central Hackney — most central of the Overground stations' },
      { name: 'London Fields', lines: 'Overground', note: 'Broadway Market and London Fields closest' },
      { name: 'Bethnal Green', lines: 'Central', note: 'south-west Hackney' },
      { name: 'Hackney Wick', lines: 'Overground', note: 'east side — for Howling Hops, Crate Brewery, Queen Elizabeth Olympic Park' }
    ],
    tips: [
      'Broadway Market is Saturdays only (9am-5pm) — Sundays the stalls are gone but the pubs, cafés, and restaurants remain.',
      'Walk the Regent\'s Canal from Broadway Market east to Victoria Park, then on to Hackney Wick — some of London\'s loveliest urban waterside.',
      'Victoria Park hosts All Points East (May) and Field Day (at Brockwell Park) festivals — central Hackney gets gig-packed in summer.',
      'Climpson\'s Arch (railway arch) does wood-fire pizza on summer-evening Saturdays — Hackney\'s best pizza outdoors.',
      'Sunday in Hackney = brunch queue at Cafe Cecilia or The Marksman, stroll Victoria Park, pint in a beer garden. Plan your day around one long meal.'
    ]
  }
];
