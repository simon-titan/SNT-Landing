"use client";
import React, { useState } from "react";
import { Box, Text, HStack, VStack, Heading, Stack, Image, Flex } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody } from "@/components/ui/dialog";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

const SNT_BLUE = "#068CEF";

const StarIcon = ({ filled = false, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill={filled ? "#FFD700" : "#E2E8F0"}
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
  </svg>
);

// Helper function to get initials
const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Mapping für Profilbilder - falls vorhanden, sonst Initialien
const profileImageMap: Record<string, string | null> = {
  "suad086": "/assets/community-stats/4208db19763848b131989eadba9899aa.avif",
  "gayretbalat": "/assets/community-stats/393d1b15978eed96285cf196b2f51eda.avif",
  "Dominik": "/assets/community-stats/user_6819319_6ec853ff-5777-4398-8fcc-06e2621cbcf8.avif",
  // Weitere können hier hinzugefügt werden
};

const reviews = [
  {
    text: "Ich bin absolut begeistert von SNTTrades! Das Mentorship ist unglaublich! Man lernt hier nicht nur theoretisch, sondern erhält auch praxisnahen Support, der einem wirklich weiterhilft. Besonders beeindruckend sind die Live Trading Sessions mit den Mentoren, bei denen man in Echtzeit von deren Erfahrung profitieren kann. Auch die Mindset-Calls mit den Mentoren sind der Hammer, sie geben mir stets den nötigen Antrieb und helfen mir, den richtigen Fokus zu behalten. Der Austausch mit anderen Mitgliedern und erfahrenen Tradern ist äußerst bereichernd. Die Mentoren stehen mit Rat und Tat zur Seite, motivieren dazu, auch in schwierigen Phasen nicht aufzugeben, und sind immer hilfsbereit. Nachdem ich zuvor mehrere teure Trading-Kurse absolviert hatte, die letztlich nur leere Versprechen waren, war es eine echte Offenbarung, SNTTrades zufällig zu entdecken. Hier bekommt man endlich das, was versprochen wird: fundiertes Wissen, echte Unterstützung und eine Community, die zusammenhält. Für mich war es die beste Entscheidung meines Lebens – wer auf der Suche nach authentischem Trading-Wissen und nachhaltiger Mentorship ist, sollte hier unbedingt vorbeischauen! SNTTrades hat meine Sicht auf Trading komplett verändert und mir gezeigt, dass man mit der richtigen Unterstützung wirklich erfolgreich sein kann. Ich kann es jedem nur wärmstens empfehlen!",
    name: "suad086",
    displayName: "SUAD",
    date: "12.03.2025",
    rating: 5,
    title: "Ich bin absolut begeistert von SNTTrades! Das Mentorship ist unglaublich!",
  },
  {
    text: "Einzig wahre Entscheidung! Es sind so viele Scammer da draußen aber die beiden Jungs sind nicht nur extrem fair, sondern auch noch sehr gut in dem was sie machen. Ich habe sehr viel gelernt und lerne immer noch. Danke für alles was ihr macht und für die mega Community. Werde demnächst meine Challenge gepasst haben. Kann es jedem nur empfehlen der ernsthaft durchziehen will und sein Lebensunterhalt mit Trading verdienen will. Ihr seid hier genau richtig. In diesem Sinne: Happy Profits!",
    name: "gayretbalat",
    displayName: "Gayret",
    date: "19.03.2025",
    rating: 5,
    title: "Einzig wahre Entscheidung",
  },
  {
    text: "Beste Entscheidung – 1:1 Coaching auf einem neuen Level! Ich hatte ein 1:1 Coaching und kann nur sagen: absolut top! Endlich mal jemand, der Trading locker, verständlich und auf den Punkt erklärt. Kein unnötiges Fachgelaber, sondern direkt umsetzbare Strategien. Ich habe wirklich viel gelernt!",
    name: "Thomas Brandt",
    displayName: "Thomas Brandt",
    date: "15.03.2025",
    rating: 5,
    title: "Beste Entscheidung - 1:1 Coaching auf einem neuen Level!",
  },
  {
    text: "Ihr versteht nicht, diese Brühs haben für so wenig Geld soviel Mehrwert gegeben und sind mir sehr ans Herz gewachsen. SNT ist schon quasi eine Familie. Wenn ihr überlegt, für diesen Preis einen Mehrwert von mehreren tausenden von Euros zu bekommen + diese krasse Community zu haben und ihr dann überlegt es nicht zu kaufen weil es zu 'Teuer' ist, dann kann man euch nicht mehr helfen. Ali und Emre danke für alles ❤️",
    name: "Alessio",
    displayName: "Alessio",
    date: "10.03.2025",
    rating: 4,
    title: "Sehr empfehlenswert",
  },
  {
    text: "Durch Ali und Emre hat sich mein Tradingskill und die Psyche enorm weiterentwickelt, ich konnte innerhalb 1 Jahr mein ersten Payout erreichen und war multiple Funded. Beste Entscheidung für den Preis, gibt es nichts besseres!",
    name: "Nabil",
    displayName: "Nabil",
    date: "10.03.2025",
    rating: 4,
    title: "Beste Entscheidung für den Preis",
  },
  {
    text: "Die Zusammenarbeit im Rahmen des Coachings war eine äußerst bereichernde Erfahrung. Durch das Coaching wurde eine unglaublich positive und motivierende Atmosphäre geschaffen, die sowohl fachlich als auch persönlich zum Wachstum anregte. Mit klaren, präzisen Ratschlägen und einer einfühlsamen, unterstützenden Herangehensweise wurde ein Raum für Weiterentwicklung geschaffen. Komplexe Themen wurden verständlich vermittelt, und es wurden praxisorientierte Werkzeuge bereitgestellt, die sofort im Alltag umsetzbar waren. Besonders wertvoll war es, wie die eigenen Stärken erkannt und gezielt weiter ausgebaut wurden.",
    name: "Unbekannt",
    displayName: "Unbekannt",
    date: "März 2025",
    rating: 4,
    title: "Bereichernde Erfahrung",
  },
  {
    text: "Meine Reise mit SNT – Ein echtes Level-Up! Ich bin jetzt seit fast einem Jahr Teil der Community – und wenn ich heute zurückblicke, ist es einfach crazy, welche Level-Ups ich in dieser Zeit gemacht habe. Seit NEFS draußen ist, geht es bei mir richtig voran – viel, viel weiter als je zuvor. Und das Krasseste: Ich habe gerade meine erste Challenge in nur 11 Handelstagen bestanden! Danke an Emre & Ali, dass ihr dieses Mentorship gestartet habt. SNT hat mein Leben verändert & es wird noch krasser, das ist erst der Anfang und ich kann es jedem empfehlen, der bereit ist, wirklich etwas zu verändern.",
    name: "Justin",
    displayName: "Justin",
    date: "12.07.2025",
    rating: 5,
    title: "Meine Reise mit SNT – Ein echtes Level-Up!",
  },
  {
    text: "An @Ali D´ TRADING & @emre CEO: Als ich euch das erste Mal auf TikTok gesehen habe, wusste ich sofort – ihr seid echt. Keine, die einfach nur Kurse verkaufen wollen, sondern Menschen mit Herz, Vision und dem echten Wunsch, dass aus uns etwas wird. Ihr wollt nicht nur Wissen weitergeben – ihr wollt Leben verändern. Und genau das tut ihr. SNT AUF DIE EINS – und das bleibt so!",
    name: "Justin",
    displayName: "Justin",
    date: "12.07.2025",
    rating: 5,
    title: "SNT AUF DIE EINS",
  },
  {
    text: "Hey Leute, ich bin vor knapp 5 Wochen gejoined. Ich trade seit über einem Jahr und habe glaube ich alle Phasen durchlaufen die man als Trader durchläuft. Try and error. Strategy hopping, dicke Verlustphasen usw. Seit einigen Monaten trade ich mit einem ordentlichen System und Risk Management. Ich konnte dadurch 13 APEX Evals bestehen, aber so richtig stabil profitabel war ich bisher nicht. Ich bin dann auf SNT gestoßen und dachte ich versuch's einfach mal und wurde nicht enttäuscht. NEFS funktioniert immer und nicht wie in anderen Strategien wo man nur den New York Open für 1-2 Stunden traden kann. Ich bin noch lange nicht am Ende der Reise aber ich kann wirklich nur jedem empfehlen der mit Trading anfängt mit SNT zu starten und NEFS zu traden. Danke an euch Jungs, macht bitte weiter so!🫡",
    name: "Marvin",
    displayName: "Marvin",
    date: "13.06.2025",
    rating: 5,
    title: "NEFS funktioniert immer",
  },
  {
    text: "Hallo, ich bin Dominik und wahrscheinlich die deutscheste Kartoffel, die ihr je kennenlernen werdet. Ich habe Anfang Februar mit dem Trading angefangen, und was soll ich sagen: Ich war wahrscheinlich genau der Typ, den keiner mochte. Wenn ich früher auf Social Media irgendwas über Trading gesehen habe, dachte ich mir jedes Mal nur: 'Das ist doch Scam. Was redet der da? Und warum nervt der mich mit seinen Videos?' – Darauf bin ich im Nachhinein nicht besonders stolz. Bis ein Kumpel mal zu mir meinte: 'Digga Dominik, wie willst du dir eigentlich eine Meinung bilden, wenn du es selbst nie ausprobiert hast?' Und ich musste ihm recht geben. Das ist etwas, was jeder halbwegs gebildete Mensch eigentlich verstehen sollte.",
    name: "Dominik",
    displayName: "Dominik",
    date: "Juni 2025",
    rating: 5,
    title: "Sehr empfehlenswert",
  },
  {
    text: "Yo yo was geht ab Leute, Erstmal zu mir, ich bin der Luciano trade schon länger jetzt mit dem Volume Profile und andere orderflow tools. Bin ganz frisch hier, aber folge die Jungs schon länger auf insta und hab ab und an Mal mit @emre CEO auf insta geschrieben. Nutze nefs jetzt selber auch es ist eine Bomben scalp Strategie die es in sich hat, ich gebe nur noch ein wenig von meiner eigenen Sauce mit rein. Ich kann euch versichern, ihr seid bei den Jungs hier gut aufgehoben. Es gibt viele Blender Fake Gurus da draussen die auch ihre PNLs etc fälschen und keinerlei Transparenz zeigen. Die Art wie @emre CEO und @Ali D´ TRADING Sachen erklären ist sehr gut und simple so dass es sogar ein 3 Klässler versteht ohne viel Schnickschnack und Drumherum Gelaber.",
    name: "Luciano",
    displayName: "Luciano",
    date: "Juli 2025",
    rating: 5,
    title: "Gut aufgehoben bei den Jungs",
  },
  {
    text: "Real Talk ---> 10/10 heißt, ganz klar nicht zu toppen!! Ich habe mir wirklich viel angeschaut was Trading Coachings angeht & deshalb glaubt mir, wenn ich euch sage, das ist ein anderes Level hier bei SNT als bei 95% der Anbieter 'vergleichbarer' Coachings... Das Preis-Leistungs-Verhältnis ist noch krasser bewertet 10/10+10 🙂 Gerade das 1zu1 Mentoring werdet ihr für das Geld sicher nirgends bekommen! Emre & Ali sind super korrekte Jungs und absolut gute Coaches! Wer sich das hier vermittelte Wissen aneignet und wirklich dran bleibt, kann nicht scheitern!",
    name: "Marcel",
    displayName: "Marcel",
    date: "Juli 2025",
    rating: 5,
    title: "Real Talk ---> 10/10",
  },
  {
    text: "Bestes Mentoring 🙏 Habe selten so einen gut aufgebauten Kurs gesehen und so lehrreiche Videos und dann noch das Livetrading was einfach das Beste ist. Meine bisherigen Erfahrungen waren mit Goldtradermo und der Kurs von fxalex (set and forget) welcher nebenbei 1500$ kostet und hier bekommt man den Kurs für knackige 240€ + die super Community.",
    name: "Marcel",
    displayName: "Marcel",
    date: "Juli 2025",
    rating: 5,
    title: "Bestes Mentoring 🙏",
  },
  {
    text: "Aus meiner Erfahrung kann ich die SNT Community definitiv weiterempfehlen. Ich habe mir vorher vieles selbst beigebracht, aber am Ende lag es vor allem an meinen Emotionen und dem fehlenden roten Faden, was in fehlendem Vertrauen in einem selbst resultierte. Das wird aber sehr gut durch den Austausch mit Gleichgesinnten und die Lehrvideos von Emre und Ali gefestigt. Es tut gut, von profitablen Mentoren alles bündig erklärt zu bekommen, weil dann Verlass darauf ist. Emre und Ali verfolge ich auf Instagram schon seit langer Zeit, noch aus den Zeiten, in denen sie Masken getragen haben. Selbst dort bekommt man schon kleine Einblicke, und sie veröffentlichen einige Strategien oder Lehrmaterial. Das kommt aber natürlich nicht an das komplette Mentorship ran. Alles in allem: Top!",
    name: "Ali",
    displayName: "Ali",
    date: "Juli 2025",
    rating: 5,
    title: "Definitiv weiterempfehlen",
  },
  {
    text: "SNT ist das beste Mentorship egal ob für Anfänger oder schon erfahrene Trader. Nachdem ich jetzt Jahre in der deutschen Tradingbranche unterwegs bin und verschiedene Mentorships beigetreten bin um das Trading zu lernen, hat mich SNT immer wieder am meisten überzeugt. Wenn man sieht wie viel andere verlangen muss man wirklich ehrlich sein der Preis ist wirklich niedrig und der Value und was man hier lernt immens. Ali und Emre haben es mit ihrer sympathischen Art geschafft ein Coaching mit Liebe zum Detail auf die Beine zu stellen. Das Lernen und Verstehen, wie der Markt funktioniert ist hier wie ein Kinderspiel, da beide hervorragend erklären. Nun zur Community, man fühlt sich wohl und zudem wie eine Trading Familie. Die Leute sind offen und deine Fragen werden beantwortet, jeder ist für jeden da. Insgesamt ist es eine perfekte Opportunity für jeden den Trading interessiert, eine neue Welt für sich zu entdecken. Ich bin dankbar ein Teil von SNT zu sein.",
    name: "Ali",
    displayName: "Ali",
    date: "Juli 2025",
    rating: 5,
    title: "Das beste Mentorship",
  },
  {
    text: "Ich bin seit ein paar Wochen dabei, und die Informationen, die ich in dieser Zeit gesammelt habe, sind einfach unbezahlbar. Dazu kommt noch die Community, die man schon fast als Familie bezeichnen kann – jeder hilft jedem, und das ist einfach erstaunlich. Ein riesiges Dankeschön an meinen Mentor! Deine Geduld, dein Wissen und deine Fähigkeit, komplexe Themen verständlich zu erklären, haben mir in kürzester Zeit so viel gebracht. Nach nur etwa 14 intensiven Tagen konnte ich dank des Wissens von Ali und Emre selbstständig Analysen durchführen und erfolgreiche Trades setzen. Ihr gebt nicht nur Strategien an die Hand, sondern vermittelt eine Denkweise, die langfristig zum Erfolg führt. Man merkt sofort, dass ihr mit Leidenschaft dabei seid und wirklich wollt, dass jeder hier erfolgreich wird. Ich bin unendlich dankbar, Teil dieser großartigen Community zu sein, und freue mich auf alles, was noch kommt!",
    name: "Ahmad",
    displayName: "Ahmad",
    date: "Juli 2025",
    rating: 5,
    title: "Unbezahlbare Informationen",
  },
];

const MAX_TEXT_LENGTH = 150;

// Avatar Component
const Avatar = ({ name, displayName }: { name: string; displayName: string }) => {
  const imagePath = profileImageMap[name] || profileImageMap[displayName];
  
  if (imagePath) {
    return (
      <Image
        src={imagePath}
        alt={displayName}
        w="40px"
        h="40px"
        borderRadius="full"
        objectFit="cover"
      />
    );
  }
  
  const initials = getInitials(displayName);
  return (
    <Box
      w="40px"
      h="40px"
      borderRadius="full"
      bg="rgba(59, 130, 246, 0.2)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="1px solid rgba(59, 130, 246, 0.3)"
    >
      <Text fontSize="sm" fontWeight="bold" color="#3b82f6">
        {initials}
      </Text>
    </Box>
  );
};

// Review Card Component
const ReviewCard = ({ text, name, displayName, date, rating, title }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > MAX_TEXT_LENGTH;
  const displayText = isExpanded ? text : (isLong ? text.slice(0, MAX_TEXT_LENGTH) + "..." : text);

  return (
    <Box
      w="full"
      py={4}
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      _last={{ borderBottom: "none" }}
    >
      <Flex justify="space-between" align="flex-start" gap={4} mb={2}>
        <HStack gap={3} flex={1}>
          <Avatar name={name} displayName={displayName} />
          <VStack align="start" gap={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium" color="white">
              {name}
            </Text>
            <HStack gap={1} mt={1}>
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} filled={i < rating} size={14} />
              ))}
            </HStack>
          </VStack>
        </HStack>
      </Flex>
      
      <VStack align="start" gap={2} mt={2}>
        <Text fontSize="sm" fontWeight="semibold" color="white">
          {title}
        </Text>
        <Text fontSize="sm" color="gray.300" lineHeight="1.6">
          {displayText}
        </Text>
        {isLong && !isExpanded && (
          <Box
            as="button"
            onClick={() => setIsExpanded(true)}
            display="flex"
            alignItems="center"
            gap={1}
            color="gray.400"
            fontSize="sm"
            fontWeight="medium"
            cursor="pointer"
            _hover={{ color: "gray.300" }}
            transition="color 0.2s ease"
          >
            <Text>Mehr anzeigen</Text>
            <CaretDown size={14} weight="bold" />
          </Box>
        )}
      </VStack>
    </Box>
  );
};

// Rating Distribution Component
const RatingDistribution = ({ reviews }: { reviews: any[] }) => {
  const distribution = [5, 4, 3, 2, 1].map(star => ({
    stars: star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  // Finde die höchste Anzahl für die Skalierung
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  return (
    <VStack align="stretch" gap={2} mt={4}>
      {distribution.map(({ stars, count }) => {
        // Berechne die Breite - viel größere Skalierung für deutlich längere Balken
        let widthPercentage = 0;
        
        if (count > 0) {
          // Für 5 Sterne (maxCount = 13): 100% Breite
          // Für 4 Sterne (count = 3): Skaliere viel größer
          // Verwende eine exponentiell größere Skalierung
          const ratio = count / maxCount;
          // Mindestbreite von 50% und dann skaliere bis 100%
          widthPercentage = 50 + (ratio * 50);
        }
        
        return (
          <HStack key={stars} gap={2} align="center">
            <Text fontSize="sm" color="gray.300" minW="60px">
              {stars} Sterne
            </Text>
            <Box flex={1} h="8px" width="105px" bg="rgba(255, 255, 255, 0.1)" borderRadius="full" overflow="hidden" position="relative">
              <Box
                h="100%"
                bg={stars === 5 ? "#FFD700" : stars === 4 ? "#FFA500" : "rgba(255, 255, 255, 0.2)"}
                w={`${widthPercentage}%`}
                transition="width 0.3s ease"
                borderRadius="full"
                minW={count > 0 ? "2px" : "0"}
              />
            </Box>
          </HStack>
        );
      })}
    </VStack>
  );
};

export const ReviewMarquee = () => {
  const [showAll, setShowAll] = useState(false);
  const totalReviews = reviews.length;
  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <Box
      w="100%"
      bg="black"
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 8 }}
    >
      <Box maxW="7xl" mx="auto">
        <Stack
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 8, lg: 12 }}
          align="flex-start"
        >
          {/* Left Side: Review Summary */}
          <Box flex={{ base: "1", lg: "0 0 300px" }} w={{ base: "full", lg: "300px" }}>
            <VStack align="start" gap={4}>
              <Heading fontSize="2xl" fontWeight="bold" color="white">
                Bewertungen
              </Heading>
              
              <HStack gap={2} align="center">
                <HStack gap={1}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} filled={i < Math.round(averageRating)} size={20} />
                  ))}
                </HStack>
                <Text fontSize="lg" fontWeight="semibold" color="white">
                  {averageRating.toFixed(1)} von 5
                </Text>
              </HStack>
              
              <Text fontSize="sm" color="gray.400">
                {totalReviews} Bewertungen insgesamt
              </Text>
              
              <RatingDistribution reviews={reviews} />
            </VStack>
          </Box>

          {/* Right Side: Reviews List */}
          <Box flex={1} minW={0}>
            <VStack align="stretch" gap={0}>
              {displayedReviews.map((review, idx) => (
                <ReviewCard key={idx} {...review} />
              ))}
              
              {!showAll && (
                <Box mt={4} pt={4} borderTop="1px solid rgba(255, 255, 255, 0.1)">
                  <Box
                    as="button"
                    onClick={() => setShowAll(true)}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    color="gray.500"
                    fontSize="sm"
                    fontWeight="medium"
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                    transition="opacity 0.2s ease"
                  >
                    <Text>Alle Bewertungen anzeigen</Text>
                    <CaretDown size={16} weight="bold" />
                  </Box>
                </Box>
              )}
            </VStack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ReviewMarquee;
