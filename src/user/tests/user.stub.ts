import { SelectUserDto, UpdateUserDto } from "src/schemas/user.schema";

export const userStub = (): SelectUserDto => {
   return {
      id: "01H7CDCCSA7V0KBDGTTZE5MSHG",
      firstName: "Carmen",
      lastName: "Calvie",
      email: "ccalvie0@amazon.co.jp",
      username: "ccalvie0",
      photoUrl: "http://dummyimage.com/216x100.png/ff4444/ffffff",
      bio: "Triple-buffered demand-driven collaboration",
      emailVerified: true
   };
};

export const userStubs = (): SelectUserDto[] => {
   return [
      {
         id: "01H7CDCCSA7V0KBDGTTZE5MSHG",
         firstName: "Carmen",
         lastName: "Calvie",
         email: "ccalvie0@amazon.co.jp",
         username: "ccalvie0",
         photoUrl: "http://dummyimage.com/216x100.png/ff4444/ffffff",
         bio: "Triple-buffered demand-driven collaboration",
         emailVerified: true
      },
      {
         id: "01H7CDCCSCHGTZ9EQK5XSCHT15",
         firstName: "Berthe",
         lastName: "Weond",
         email: "bweond1@umn.edu",
         username: "bweond1",
         photoUrl: "http://dummyimage.com/111x100.png/cc0000/ffffff",
         bio: "Monitored reciprocal archive",
         emailVerified: false
      },
      {
         id: "01H7CDCCSD9HG4RXQ57FT44H1J",
         firstName: "Lewes",
         lastName: "Weller",
         email: "lweller2@nifty.com",
         username: "lweller2",
         photoUrl: "http://dummyimage.com/244x100.png/5fa2dd/ffffff",
         bio: "Fundamental reciprocal concept",
         emailVerified: true
      },
      {
         id: "01H7CDCCSEP3BPNM8QPQSB6X81",
         firstName: "Adora",
         lastName: "Lanchbury",
         email: "alanchbury3@blogs.com",
         username: "alanchbury3",
         photoUrl: "http://dummyimage.com/234x100.png/cc0000/ffffff",
         bio: "Function-based bifurcated task-force",
         emailVerified: true
      },
      {
         id: "01H7CDCCSFS0ZCH6SSDFMWZZ0X",
         firstName: "Kennedy",
         lastName: "Kirkup",
         email: "kkirkup4@globo.com",
         username: "kkirkup4",
         photoUrl: "http://dummyimage.com/103x100.png/dddddd/000000",
         bio: "Distributed heuristic forecast",
         emailVerified: false
      },
      {
         id: "01H7CDCCSGGJYCSMN06GBYNCG7",
         firstName: "Darbie",
         lastName: "Snell",
         email: "dsnell5@indiegogo.com",
         username: "dsnell5",
         photoUrl: "http://dummyimage.com/167x100.png/cc0000/ffffff",
         bio: "Switchable attitude-oriented parallelism",
         emailVerified: false
      },
      {
         id: "01H7CDCCSH70W24HQ2KSM95721",
         firstName: "Evie",
         lastName: "Mortlock",
         email: "emortlock6@mozilla.org",
         username: "emortlock6",
         photoUrl: "http://dummyimage.com/208x100.png/ff4444/ffffff",
         bio: "Up-sized dedicated internet solution",
         emailVerified: true
      },
      {
         id: "01H7CDCCSJ35HE2B9EQ63CZPW2",
         firstName: "Alyse",
         lastName: "Trappe",
         email: "atrappe7@toplist.cz",
         username: "atrappe7",
         photoUrl: "http://dummyimage.com/114x100.png/5fa2dd/ffffff",
         bio: "Right-sized responsive ability",
         emailVerified: true
      },
      {
         id: "01H7CDCCSMAYDVSHP03KM1RPN2",
         firstName: "Jillane",
         lastName: "Ogglebie",
         email: "jogglebie8@blogspot.com",
         username: "jogglebie8",
         photoUrl: "http://dummyimage.com/161x100.png/ff4444/ffffff",
         bio: "Self-enabling zero tolerance info-mediaries",
         emailVerified: true
      },
      {
         id: "01H7CDCCSNN5Q393TGJV4MHP4Q",
         firstName: "Erick",
         lastName: "Ditchburn",
         email: "editchburn9@hud.gov",
         username: "editchburn9",
         photoUrl: "http://dummyimage.com/105x100.png/dddddd/000000",
         bio: "Exclusive client-driven toolset",
         emailVerified: true
      }
   ];
};

export const userUpdateStub = (): UpdateUserDto => {
   return {
      firstName: "Lyndsie",
      email: "lchoulerton0@ucla.edu",
      username: "lchoulerton0"
   };
};
