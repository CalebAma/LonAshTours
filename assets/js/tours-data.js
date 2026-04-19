/**
 * LonAsh Tours — Static Tour Data
 * Static seed data for tours (used by the marketing site and demos).
 */

export const staticTours = [
    {
        id: 'cape-coast-kakum',
        title: 'Cape Coast Castle & Kakum Canopy Walk',
        category: 'educational',
        duration: '2 Days',
        price: 450,
        image: 'https://images.unsplash.com/photo-1620052739343-470a7f05359a?auto=format&fit=crop&q=80&w=800',
        description: 'Journey through the powerful history of the slave trade at Cape Coast Castle, then soar above the rainforest canopy at Kakum National Park. A deeply moving and adventurous experience.',
        highlights: ['Cape Coast Castle UNESCO site', 'Kakum Canopy Walk (7 bridges)', 'Elmina Castle visit', 'Local seafood lunch included'],
        location: 'Central Region',
        popular: true,
        createdAt: '2026-01-10T08:00:00Z'
    },
    {
        id: 'accra-city-tour',
        title: 'Accra City Discovery Tour',
        category: 'adventure',
        duration: '1 Day',
        price: 250,
        image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?auto=format&fit=crop&q=80&w=800',
        description: 'Explore the vibrant pulse of Ghana\'s capital — from the historic Jamestown lighthouse and Kwame Nkrumah Memorial Park to the bustling Makola Market and modern Osu district.',
        highlights: ['Kwame Nkrumah Museum', 'Jamestown Lighthouse', 'Makola Market', 'Arts Centre shopping'],
        location: 'Greater Accra',
        popular: true,
        createdAt: '2026-01-12T08:00:00Z'
    },
    {
        id: 'kumasi-culture',
        title: 'Kumasi Cultural Heritage Tour',
        category: 'educational',
        duration: '3 Days',
        price: 680,
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
        description: 'Immerse yourself in the rich Ashanti culture at the Manhyia Palace Museum, witness the world\'s largest open-air market Kejetia, and explore Kente weaving villages.',
        highlights: ['Manhyia Palace Museum', 'Kejetia Market', 'Bonwire Kente village', 'Lake Bosomtwe'],
        location: 'Ashanti Region',
        popular: false,
        createdAt: '2026-01-15T08:00:00Z'
    },
    {
        id: 'mole-safari',
        title: 'Mole National Park Safari',
        category: 'wildlife',
        duration: '3 Days',
        price: 920,
        image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800',
        description: 'Trek alongside wild elephants, rare birds, and hippos in Ghana\'s largest national park. A bucket-list experience in the heart of northern Ghana\'s savannah ecosystem.',
        highlights: ['Guided elephant walking safari', 'Bird watching (300+ species)', 'Hippo pool visit', 'Lodge accommodation included'],
        location: 'Northern Region',
        popular: true,
        createdAt: '2026-01-18T08:00:00Z'
    },
    {
        id: 'volta-lake-eco',
        title: 'Volta Region Eco Adventure',
        category: 'nature',
        duration: '2 Days',
        price: 480,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
        description: 'Cruise on Lake Volta (the world\'s largest man-made lake), hike to the Wli Waterfalls, and visit the Tafi Atome Monkey Sanctuary for a truly unique nature retreat.',
        highlights: ['Lake Volta boat cruise', 'Wli Waterfalls hike', 'Tafi Atome Monkey Sanctuary', 'Amedzofe canopy walk'],
        location: 'Volta Region',
        popular: true,
        createdAt: '2026-01-20T08:00:00Z'
    },
    {
        id: 'elmina-beach',
        title: 'Elmina Castle & Beach Retreat',
        category: 'adventure',
        duration: '1 Day',
        price: 320,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
        description: 'Visit the oldest European building in sub-Saharan Africa at Elmina Castle, then relax on the golden sands of Coconut Grove Beach. Perfect for history and leisure lovers.',
        highlights: ['Elmina Castle UNESCO site', 'Coconut Grove Beach', 'Fresh seafood by the sea', 'Sunset boat ride'],
        location: 'Central Region',
        popular: false,
        createdAt: '2026-01-22T08:00:00Z'
    },
    {
        id: 'boti-falls',
        title: 'Boti Falls & Umbrella Rock Trek',
        category: 'nature',
        duration: '1 Day',
        price: 200,
        image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800',
        description: 'Hike through lush forest to the stunning twin Boti Waterfalls, then climb the iconic Umbrella Rock for panoramic views of the Eastern Region\'s rolling green hills.',
        highlights: ['Boti Twin Waterfalls', 'Umbrella Rock viewpoint', 'Forest nature walk', 'Picnic lunch by the falls'],
        location: 'Eastern Region',
        popular: false,
        createdAt: '2026-01-25T08:00:00Z'
    },
    {
        id: 'ada-estuary',
        title: 'Ada Estuary & Coconut Islands',
        category: 'adventure',
        duration: '1 Day',
        price: 280,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
        description: 'Where the Volta River meets the Atlantic Ocean — cruise through the Ada Estuary, explore coconut islands, and enjoy some of Ghana\'s most tranquil and scenic beaches.',
        highlights: ['Estuary boat cruise', 'Coconut island exploration', 'Ada Foah beach relaxation', 'Water sports available'],
        location: 'Greater Accra',
        popular: false,
        createdAt: '2026-01-28T08:00:00Z'
    }
];

/**
 * Get tours — returns static data
 */
export const getFeaturedTours = () => staticTours.filter(t => t.popular).slice(0, 3);
export const getAllTours = () => staticTours;
export const getTourById = (id) => staticTours.find(t => t.id === id) || null;
