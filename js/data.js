/* =========================================================
   Apostolic Media
   Application Data
   File: js/data.js
   ========================================================= */

(function (window) {
  "use strict";

  const DATA = {

    // =======================================================
    // Application information
    // =======================================================
    app: {
      name: "የኢየሱስ ልጆች Apostolic Media",
      shortName: "Apostolic Media",
      tagline:
        "Wherever you are, join the same Apostolic Christian community."
    },

    // =======================================================
    // Navigation menu
    // =======================================================
    navigation: [
      {
        id: "home",
        title: "Home",
        icon: "🏠",
        route: "#home"
      },
      {
        id: "songs",
        title: "Songs",
        icon: "🎵",
        route: "#songs"
      },
      {
        id: "lyrics",
        title: "Lyrics",
        icon: "📝",
        route: "#lyrics"
      },
      {
        id: "artists",
        title: "Artists & Ministers",
        icon: "🎤",
        route: "#artists"
      },
      {
        id: "teachings",
        title: "Teachings",
        icon: "📖",
        route: "#teachings"
      },
      {
        id: "sermons",
        title: "Sermons",
        icon: "🎙️",
        route: "#sermons"
      },
      {
        id: "bible",
        title: "Bible",
        icon: "📕",
        route: "#bible"
      },
      {
        id: "bible-study",
        title: "Bible Study",
        icon: "🔎",
        route: "#bible-study"
      },
      {
        id: "courses",
        title: "Courses",
        icon: "🎓",
        route: "#courses"
      },
      {
        id: "videos",
        title: "Videos",
        icon: "▶️",
        route: "#videos"
      },
      {
        id: "live",
        title: "Live",
        icon: "🔴",
        route: "#live"
      },
      {
        id: "community",
        title: "Community",
        icon: "👥",
        route: "#community"
      },
      {
        id: "events",
        title: "Events",
        icon: "📅",
        route: "#events"
      },
      {
        id: "playlists",
        title: "Playlists",
        icon: "🎼",
        route: "#playlists"
      }
    ],

    // =======================================================
    // Home page sections
    // =======================================================
    homeSections: [
      {
        id: "featured",
        title: "Featured",
        type: "featured"
      },
      {
        id: "recent",
        title: "Recently Added",
        type: "recent"
      },
      {
        id: "songs",
        title: "Latest Songs",
        type: "songs"
      },
      {
        id: "teachings",
        title: "Christian Teachings",
        type: "teachings"
      },
      {
        id: "sermons",
        title: "Latest Sermons",
        type: "sermons"
      },
      {
        id: "videos",
        title: "Latest Videos",
        type: "videos"
      },
      {
        id: "events",
        title: "Upcoming Events",
        type: "events"
      }
    ],

    // =======================================================
    // Languages
    // =======================================================
    languages: [
      {
        code: "am",
        name: "አማርኛ",
        englishName: "Amharic",
        direction: "ltr"
      },
      {
        code: "en",
        name: "English",
        englishName: "English",
        direction: "ltr"
      },
      {
        code: "om",
        name: "Afaan Oromoo",
        englishName: "Afaan Oromoo",
        direction: "ltr"
      }
    ],

    // =======================================================
    // Content categories
    // =======================================================
    categories: [
      {
        id: "apostolic",
        name: "Apostolic",
        icon: "✝️"
      },
      {
        id: "worship",
        name: "Worship",
        icon: "🙏"
      },
      {
        id: "praise",
        name: "Praise",
        icon: "🙌"
      },
      {
        id: "teaching",
        name: "Teaching",
        icon: "📖"
      },
      {
        id: "sermon",
        name: "Sermon",
        icon: "🎙️"
      },
      {
        id: "bible-study",
        name: "Bible Study",
        icon: "📚"
      },
      {
        id: "testimony",
        name: "Testimony",
        icon: "❤️"
      },
      {
        id: "prayer",
        name: "Prayer",
        icon: "🙏"
      }
    ],

    // =======================================================
    // Sample songs
    // =======================================================
    songs: [
      {
        id: "song-001",
        title: "Sample Apostolic Song",
        artist: "Apostolic Media",
        language: "en",
        category: "worship",
        duration: "00:00",
        audioUrl: "",
        coverUrl: "",
        featured: true
      },
      {
        id: "song-002",
        title: "የኢየሱስ ፍቅር",
        artist: "Apostolic Media",
        language: "am",
        category: "worship",
        duration: "00:00",
        audioUrl: "",
        coverUrl: "",
        featured: false
      }
    ],

    // =======================================================
    // Sample teachings
    // =======================================================
    teachings: [
      {
        id: "teaching-001",
        title: "Christian Written Teachings",
        description:
          "Read original Christian articles, teachings, Bible studies, and other written materials.",
        language: "en",
        category: "teaching",
        author: "Apostolic Media",
        imageUrl: "",
        contentUrl: ""
      }
    ],

    // =======================================================
    // Sample sermons
    // =======================================================
    sermons: [
      {
        id: "sermon-001",
        title: "Apostolic Christian Sermon",
        description:
          "Listen to Christian sermons and messages.",
        language: "en",
        speaker: "Apostolic Media",
        audioUrl: "",
        videoUrl: "",
        imageUrl: ""
      }
    ],

    // =======================================================
    // Sample videos
    // =======================================================
    videos: [
      {
        id: "video-001",
        title: "Apostolic Christian Video",
        description:
          "Christian videos, teachings, worship and ministry content.",
        language: "en",
        videoUrl: "",
        thumbnailUrl: "",
        duration: "00:00"
      }
    ],

    // =======================================================
    // Bible study categories
    // =======================================================
    bibleStudies: [
      {
        id: "study-001",
        title: "Bible Study",
        description:
          "Study the Bible and grow in Christian understanding.",
        language: "en",
        level: "beginner"
      },
      {
        id: "study-002",
        title: "Apostolic Christian Studies",
        description:
          "Explore Apostolic Christian teachings through Scripture.",
        language: "en",
        level: "intermediate"
      }
    ],

    // =======================================================
    // Events
    // =======================================================
    events: [],

    // =======================================================
    // Artists / ministers
    // =======================================================
    artists: [],

    // =======================================================
    // Playlists
    // =======================================================
    playlists: [],

    // =======================================================
    // Community posts
    // =======================================================
    communityPosts: [],

    // =======================================================
    // Search configuration
    // =======================================================
    searchableCollections: [
      "songs",
      "teachings",
      "sermons",
      "videos",
      "artists",
      "bibleStudies",
      "events"
    ]
  };

  // =========================================================
  // Utility functions
  // =========================================================

  DATA.getById = function (collection, id) {
    if (!Array.isArray(DATA[collection])) {
      return null;
    }

    return (
      DATA[collection].find(function (item) {
        return item.id === id;
      }) || null
    );
  };

  DATA.getCollection = function (collection) {
    if (!Array.isArray(DATA[collection])) {
      return [];
    }

    return DATA[collection];
  };

  DATA.search = function (query) {
    const searchTerm = String(query || "")
      .trim()
      .toLowerCase();

    if (!searchTerm) {
      return [];
    }

    const results = [];

    DATA.searchableCollections.forEach(function (collectionName) {
      const collection = DATA[collectionName];

      if (!Array.isArray(collection)) {
        return;
      }

      collection.forEach(function (item) {
        const searchableText = [
          item.title,
          item.name,
          item.description,
          item.artist,
          item.author,
          item.speaker,
          item.language,
          item.category
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (searchableText.includes(searchTerm)) {
          results.push({
            ...item,
            collection: collectionName
          });
        }
      });
    });

    return results;
  };

  DATA.filterByLanguage = function (collection, language) {
    if (!Array.isArray(DATA[collection])) {
      return [];
    }

    return DATA[collection].filter(function (item) {
      return !item.language || item.language === language;
    });
  };

  DATA.filterByCategory = function (collection, category) {
    if (!Array.isArray(DATA[collection])) {
      return [];
    }

    return DATA[collection].filter(function (item) {
      return item.category === category;
    });
  };

  // =========================================================
  // Public global object
  // =========================================================

  window.ApostolicData = DATA;

})(window);
