import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Filter, Download, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { FilterPanel } from "@/components/FilterPanel";
import { CategoryStats } from "@/components/CategoryStats";
import { ExportButton } from "@/components/ExportButton";
import { classifyBusiness, addClassificationToData, getCategoryStats } from "@/utils/classifier";
import customBG from "@/assets/cover.png";
const luxLeadsLogo = "/lovable-uploads/72645a97-d464-43a4-b3ff-822d41ea5a10.png";


const businessData = [
  { name: "X MOTORS", phone: "+971 588632948", description: "CAR DEALERSHIP IN UAE" },
  { name: "ALBA CARS", phone: "+971 43772504", description: "CAR DEALERSHIP IN UAE" },
  { name: "PREMIUM CARS", phone: "+971 566227770", description: "CAR DEALERSHIP IN UAE" },
  { name: "LMG MOTORS", phone: "+971 529970773", description: "CAR DEALERSHIP IN UAE" },
  { name: "BLACK LINE MOTOR", phone: "+971 566884896", description: "CAR DEALERSHIP IN UAE" },
  { name: "CV USED AUTOMOBILE", phone: "+971 43940068", description: "CAR DEALERSHIP IN UAE" },
  { name: "PROJECT ONE", phone: "+971 568465879", description: "CAR DEALERSHIP IN UAE" },
  { name: "A1", phone: "+971 562111171", description: "CAR DEALERSHIP IN UAE" },
  { name: "# MOTORS", phone: "+971 542909999", description: "CAR DEALERSHIP IN UAE" },
  { name: "TM AUTO MOTIVE", phone: "+971 528667579", description: "CAR DEALERSHIP IN UAE" },
  { name: "CARUGATI", phone: "+971 501815071", description: "CAR DEALERSHIP IN UAE" },
  { name: "NOVA LUXURY CARS", phone: "+971 501104844", description: "CAR DEALERSHIP IN UAE" },
  { name: "FIRST MOTORS", phone: "+971 505863734", description: "CAR DEALERSHIP IN UAE" },
  { name: "APPROVED", phone: "+971 52 1323976", description: "CAR DEALERSHIP IN UAE" },
  { name: "DOURADO LUXURY CARS", phone: "+971 547065448", description: "CAR DEALERSHIP IN UAE" },
  { name: "LUXURY LOUNGE", phone: "+971 505600508", description: "CAR DEALERSHIP IN UAE" },
  { name: "TAJ AL IMPRATOOR CARS", phone: "+971 52 926 0002", description: "CAR DEALERSHIP IN UAE" },
  { name: "GTA CARS", phone: "+971 56 545 3557", description: "CAR DEALERSHIP IN UAE" },
  { name: "F7 MOTORS", phone: "+971 561991954", description: "CAR DEALERSHIP IN UAE" },
  { name: "NINJA AUTO MOBILE", phone: "+971 509052283", description: "CAR DEALERSHIP IN UAE" },
  { name: "AK7 AUTO", phone: "+971 567777401", description: "CAR DEALERSHIP IN UAE" },
  { name: "BELLA LUXURY AUCTIONS", phone: "+971 585075550", description: "CAR DEALERSHIP IN UAE" },
  { name: "MATTEW SIAGHA", phone: "+971 528397845", description: "dealer" },
  { name: "BROKER", phone: "+971 554707340", description: "BROKER" },
  { name: "WESAM ZAID", phone: "+971 585414688", description: "BROKER" },
  { name: "AJAZ SHEIKH", phone: "+971 503595474", description: "PRIVATE OWNER" },
  { name: "RASHED AL HUSSAINI", phone: "+971 502111137", description: "BROKER" },
  { name: "A G", phone: "+971 508888591", description: "BROKER" },
  { name: "M.S.R", phone: "+971 555555359", description: "PRIVATE OWNER" },
  { name: "THE ELITE CARS", phone: "+971 528693187", description: "CAR DEALERSHIP IN UAE" },
  { name: "IHAB MOURAD", phone: "+971 552700053", description: "BROKER" },
  { name: "MAMALI KAZEROUNI", phone: "+971 504574624", description: "PRIVATE OWNER" },
  { name: "MAESTRO MENA MOTORS", phone: "+971 585973763", description: "CAR DEALERSHIP IN UAE" },
  { name: "TEC MILANO", phone: "+971 501119735", description: "CAR DEALERSHIP IN UAE" },
  { name: "CHROME USED CARS", phone: "+971 542454232", description: "CAR DEALERSHIP IN UAE" },
  { name: "GANGSTA PARADISE", phone: "+971 585825552", description: "CAR DEALERSHIP IN UAE" },
  { name: "KARABAKH MOTORS", phone: "+971 551898768", description: "CAR DEALERSHIP IN UAE" },
  { name: "MARIE", phone: "+971 526669666", description: "BROKER" },
  { name: "MASTER GALLERY", phone: "+971 542338822", description: "CAR DEALERSHIP IN UAE" },
  { name: "AL QALAM", phone: "+971 566260980", description: "CAR DEALERSHIP IN UAE" },
  { name: "PAVEL", phone: "+971 564282864", description: "PRIVATE OWNER" },
  { name: "SUN CITY", phone: "+971 522470985", description: "CAR DEALERSHIP IN UAE" },
  { name: "EXOTIC CARS", phone: "+971 552446000", description: "CAR DEALERSHIP IN UAE" },
  { name: "ADEL ELIAS METNI", phone: "+971 563510553", description: "PRIVATE OWNER" },
  { name: "THAHAB", phone: "+971 547973255", description: "CAR DEALERSHIP IN UAE" },
  { name: "VALLUX BROKERS", phone: "+971 58523315", description: "BROKER" },
  { name: "DAVID", phone: "+971 50 557 1353", description: "PRIVATE OWNER" },
  { name: "AUTO LAND", phone: "+971 42 846677", description: "CAR DEALERSHIP IN UAE" },
  { name: "Andrei Melentev", phone: "+971 504589926", description: "PRIVATE OWNER" },
  { name: "Al Ain Class Motors", phone: "+971 43782222", description: "CAR DEALERSHIP IN UAE" },
  { name: "THE PUPIL OF FATE MOTORS", phone: "+971 50 318 9544", description: "CAR DEALERSHIP IN UAE" },
  { name: "Rustam Damir", phone: "+971 561116446", description: "BROKER" },
  { name: "Imran Turdiev", phone: "+971 504499089", description: "BROKER" },
  { name: "CARZILLA", phone: "+971 505267841", description: "CAR DEALERSHIP IN UAE" },
  { name: "AUTO DEALES", phone: "+971 565605656", description: "CAR DEALERSHIP IN UAE" },
  { name: "Rayan", phone: "+971 501473110", description: "PRIVATE OWNER" },
  { name: "Kamdhenu cars", phone: "+971 589984684", description: "CAR DEALERSHIP IN UAE" },
  { name: "Park Lane Motors", phone: "+971 48156571", description: "CAR DEALERSHIP IN UAE" },
  { name: "Torsten Markwald", phone: "+971 581420812", description: "BROKER" },
  { name: "ALVARO LAGO BERGANZA", phone: "+971 558255465", description: "PRIVATE OWNER" },
  { name: "ALFARIS AUTO TRADING", phone: "+971 509766600", description: "CAR DEALERSHIP IN UAE" },
  { name: "AMJAD", phone: "+971 56 9706419", description: "PRIVATE OWNER" },
  { name: "VIP Motors", phone: "+971 527990114", description: "CAR DEALERSHIP IN UAE" },
  { name: "Slava R", phone: "+971 568118722", description: "PRIVATE OWNER" },
  { name: "Sanam Cars", phone: "+971 505082577", description: "CAR DEALERSHIP IN UAE" },
  { name: "Ahmed A", phone: "+971 508888354", description: "BROKER" },
  { name: "Quatro Motors", phone: "+971 506704904", description: "CAR DEALERSHIP IN UAE" },
  { name: "Royal Motors", phone: "+971 566514777", description: "CAR DEALERSHIP IN UAE" },
  { name: "Layah Motors", phone: "+971 504699655", description: "CAR DEALERSHIP IN UAE" },
  { name: "Al Marwa Cars Showroom", phone: "+971 559165470", description: "CAR DEALERSHIP IN UAE" },
  { name: "FM", phone: "+971 559197052", description: "PRIVATE OWNER" },
  { name: "Fahad AL t", phone: "+971 508550107", description: "BROKER" },
  { name: "Alex Koryakov", phone: "+971 551932767", description: "PRIVATE OWNER" },
  { name: "BROKER", phone: "+971 502949645", description: "BROKER" },
  { name: "Milele Motors FZE", phone: "+971 505053650", description: "CAR DEALERSHIP IN UAE" },
  { name: "LE POTENZA FZCO", phone: "+971 50 40 53 111", description: "CAR DEALERSHIP IN UAE" },
  { name: "A A A MIDDLE EAST BROKERS", phone: "+971 544614222", description: "BROKER" },
  { name: "Rajiv Lund", phone: "+971 585822301", description: "PRIVATE OWNER" },
  { name: "zahra khazaeipoul", phone: "+971 5516 51708", description: "PRIVATE OWNER" },
  { name: "C", phone: "+971 589690239", description: "PRIVATE OWNER" },
  { name: "Oscar luxury Auto", phone: "+971 504004007", description: "CAR DEALERSHIP IN UAE" },
  { name: "Basra Tower", phone: "+971 561800088", description: "CAR DEALERSHIP IN UAE" },
  { name: "VIP CLASS MOTORS", phone: "+971 528351110", description: "CAR DEALERSHIP IN UAE" },
  { name: "Expat Motor Trading L.L.C", phone: "+971 529437062", description: "CAR DEALERSHIP IN UAE" },
  { name: "AASHIR SAUDAGAR", phone: "+971 544448181", description: "CAR DEALERSHIP IN UAE" },
  { name: "François Premier", phone: "+971 585113288", description: "PRIVATE OWNER" },
  { name: "Tania Tucci", phone: "+971 526469813", description: "BROKER" },
  { name: "Stoub Biz Motors", phone: "+971 523102703", description: "CAR DEALERSHIP IN UAE" },
  { name: "arlou santos", phone: "+971 504585741", description: "PRIVATE OWNER" },
  { name: "ALVARO LAGO BERGANZA", phone: "+971 558255465", description: "PRIVATE OWNER" },
  { name: "luca valori", phone: "+971 585729719", description: "CAR DEALERSHIP IN UAE" },
  { name: "Rahul K", phone: "+971 50 251 5965", description: "BROKER" },
  { name: "S TM", phone: "+971 562286060", description: "PRIVATE OWNER" },
  { name: "Vatsal Goyal", phone: "+971 503688005", description: "PRIVATE OWNER" },
  { name: "Abdullah AbdelqadeR", phone: "+971 55 882 2508", description: "PRIVATE OWNER" },
  { name: "SEREDIN MOTORS L.L.C", phone: "+971 52 711 9756", description: "CAR DEALERSHIP IN UAE" },
  { name: "Bulk Used Cars Trading", phone: "+971 54 466 4989", description: "CAR DEALERSHIP IN UAE" },
  { name: "SEVEN", phone: "+971 50 975 8560", description: "CAR DEALERSHIP IN UAE" },
  { name: "special art motors", phone: "+971 525187487", description: "CAR DEALERSHIP IN UAE" },
  { name: "EMIRATI ONE MOTORS", phone: "+971 507667744", description: "CAR DEALERSHIP IN UAE" },
  { name: "HAMEED / BABELLI CLASSICS", phone: "+971 56 752 4868", description: "CAR DEALERSHIP IN UAE" },
  { name: "GTS Motors", phone: "+971 52 585 8000", description: "CAR DEALERSHIP IN UAE" },
  { name: "Carbon Cars & Motorcycles", phone: "+971 55 774 4252", description: "CAR DEALERSHIP IN UAE" },
  { name: "VIP Design Luxury Automobiles", phone: "+971 54 519 3155", description: "CAR DEALERSHIP IN UAE" },
  { name: "Top Line Motors", phone: "+971 50 130 9400", description: "CAR DEALERSHIP IN UAE" },
  { name: "Alo Cars", phone: "+971 50 681 0101", description: "CAR DEALERSHIP IN UAE" },
  { name: "hiCar", phone: "+971 586639676", description: "CAR DEALERSHIP IN UAE" },
  { name: "Mark Bgs", phone: "+971 50 648 8020", description: "PRIVATE OWNER" },
  { name: "Mohammad Al Karak Used Cars", phone: "+971 50 117 6830", description: "CAR DEALERSHIP IN UAE" },
  { name: "Formula Motors", phone: "+971 56 212 4243", description: "CAR DEALERSHIP IN UAE" },
  { name: "CARBAY L.L.C", phone: "+971 58 926 9911", description: "CAR DEALERSHIP IN UAE" },
  { name: "777 CARS TRADING", phone: "+971 526693953", description: "CAR DEALERSHIP IN UAE" },
  { name: "Levant Auto Trading", phone: "+971 54 252 2052", description: "CAR DEALERSHIP IN UAE" },
  { name: "Pearl Motors Luxury", phone: "+971 50 210 3799", description: "CAR DEALERSHIP IN UAE" },
  { name: "AM ONE AND ONLY", phone: "+971 56 752 5156", description: "CAR DEALERSHIP IN UAE" },
  { name: "Formula Motors L.L.C", phone: "+971 56 212 4243", description: "CAR DEALERSHIP IN UAE" },
  { name: "8BA MOTORS", phone: "+971 54 314 4431", description: "CAR DEALERSHIP IN UAE" },
  { name: "Performatch Cars", phone: "+971 50 678 6842", description: "CAR DEALERSHIP IN UAE" },
  { name: "Pegasus Automobile", phone: "+971 54 206 8615", description: "CAR DEALERSHIP IN UAE" },
  { name: "Topaz Used Automobile Trading", phone: "+971 55 553 3633", description: "CAR DEALERSHIP IN UAE" },
  { name: "Kyosuke Motors", phone: "+971 50 739 8066", description: "CAR DEALERSHIP IN UAE" },
  { name: "Stoub Biz Motors", phone: "+971 523102703", description: "CAR DEALERSHIP IN UAE" },
  { name: "BARCODE USED AUTOMOBILE", phone: "+971 50 602 9051", description: "CAR DEALERSHIP IN UAE" },
  { name: "Barugzai Motors", phone: "+971 588283577", description: "CAR DEALERSHIP IN UAE" },
  { name: "Husain Asmal", phone: "+971 58 585 2078", description: "BROKER" },
  { name: "ولد الظواهر", phone: "+971 50 255 5521", description: "PRIVATE OWNER" },
  { name: "Hussain Al Amry", phone: "+971 50 717 2726", description: "BROKER" },
  { name: "claudio", phone: "+971 50 763 0270", description: "DEALER" },
  { name: "Taj Al Sultan Used Cars", phone: "+971 52 100 9119", description: "CAR DEALERSHIP IN UAE" },
  { name: "Swatantra Rana", phone: "+971 52 476 8201", description: "BROKER" },
  { name: "The Car Superstore", phone: "+971 588671409", description: "CAR DEALERSHIP IN UAE" },
  { name: "SOLA MOTORS", phone: "+971 523094865", description: "CAR DEALERSHIP IN UAE" },
  { name: "A CLASS MOTORS USED", phone: "+971 52 188 3826", description: "CAR DEALERSHIP IN UAE" },
  { name: "Laith Alobaidi Motors", phone: "+971 56 818 6033", description: "CAR DEALERSHIP IN UAE" },
  { name: "Prestige Motors LLC", phone: "+971 56 992 6508", description: "CAR DEALERSHIP IN UAE" },
  { name: "Deni Akhm", phone: "+971 55 429 8057", description: "PRIVATE OWNER" },
  { name: "Adam Hajjo", phone: "+971 50 631 0065", description: "PRIVATE OWNER" },
  { name: "Alper Özcan", phone: "+971 55 668 9857", description: "BROKER" },
  { name: "Aqeel Abdulla", phone: "+971 50 340 3440", description: "PRIVATE OWNER" },
  { name: "Mike SLC", phone: "+971 50 790 3412", description: "BROKER" },
  { name: "Harshit Trehan", phone: "+971 58 588 4283", description: "PRIVATE OWNER" },
  { name: "malo alblooshi", phone: "+971 50 199 9667", description: "PRIVATE OWNER" },
  { name: "LAKHANI MOTORS", phone: "+971 568779986", description: "CAR DEALERSHIP IN UAE" },
  { name: "SYAN USED AUTOMOBILE", phone: "+971 52 222 2559", description: "CAR DEALERSHIP IN UAE" },
  { name: "Anzelle Berowsky", phone: "+971 582406161", description: "PRIVATE OWNER" },
  { name: "Tabriz Mammadov", phone: "+971 56 493 2824", description: "PRIVATE OWNER" },
  { name: "Alexandru-Octavian Grumaz", phone: "+971 529733334", description: "PRIVATE OWNER" },
  { name: "GE MOTORS INTERNATIONAL", phone: "+971 55 718 8910", description: "CAR DEALERSHIP IN UAE" },
  { name: "PRIVATE", phone: "+971 52 222 2515", description: "PRIVATE OWNER" },
  { name: "MIKE", phone: "+971 54 430 2631", description: "PRIVATE OWNER" },
  { name: "David Léa", phone: "+971 585843965", description: "PRIVATE OWNER" },
  { name: "1 OF 10 MOTORS", phone: "+971 56 160 0050", description: "CAR DEALERSHIP IN UAE" },
  { name: "hamid M", phone: "+971 50 450 9682", description: "BROKER" },
  { name: "Jay Holland", phone: "+971 58 562 1165", description: "PRIVATE OWNER" },
  { name: "ty lee", phone: "+971 44280246", description: "PRIVATE OWNER" },
  { name: "Drivenchy Motors", phone: "+971 50 740 0644", description: "CAR DEALERSHIP IN UAE" },
  { name: "Rami Raw", phone: "+971 55 655 5549", description: "PRIVATE OWNER" },
  { name: "Sebnem Yilmaz", phone: "+971 58 179 0908", description: "BROKER" },
  { name: "SAJ JAVED", phone: "+971 55 202 6602", description: "PRIVATE OWNER" },
  { name: "Ramil Shersheyev", phone: "+971 56 344 1149", description: "CAR RENTAL" },
  { name: "Muhammad Waziri isa", phone: "+971 56 834 3806", description: "BROKER" },
  { name: "Daniel", phone: "+971 54 432 3777", description: "PRIVATE OWNER" },
  { name: "AHMED", phone: "+971 50 183 6977", description: "CAR RENTAL" },
  { name: "MANGAME MOTORS", phone: "+971 58 888 8689", description: "CAR DEALERSHIP IN UAE" },
  { name: "SYED SHAHZAD ALI", phone: "+971 50 914 7065", description: "PRIVATE OWNER" },
  { name: "S A", phone: "+971 586890307", description: "PRIVATE OWNER" },
  { name: "Richard Nagy", phone: "+971 50 208 5282", description: "PRIVATE OWNER" },
  { name: "Samir Houari", phone: "+971 58 672 4063", description: "PRIVATE OWNER" },
  { name: "RMA Motors", phone: "+971 48219706", description: "CAR DEALERSHIP IN UAE" },
  { name: "Godfrey P", phone: "+971 50 421 5050", description: "PRIVATE OWNER" },
  { name: "AUTORITY MOTORS", phone: "+971 56 494 8888", description: "CAR DEALERSHIP IN UAE" },
  { name: "GT Motors L.L.C", phone: "+971 56 612 4545", description: "CAR DEALERSHIP IN UAE" },
  { name: "mayed ahmad", phone: "+971 561145748", description: "BROKER" },
  { name: "Nasir Nasir", phone: "+971 55 502 0348", description: "PRIVATE OWNER" },
  { name: "ROCKERS AUTOHAUS L.L.C", phone: "+971 52 200 2992", description: "CAR DEALERSHIP IN UAE" },
  { name: "Noureldin Abdelalim", phone: "+971 56 345 3245", description: "PRIVATE OWNER" },
  { name: "Aly Adel", phone: "+971 56 113 0256", description: "PRIVATE OWNER" },
  { name: "E A", phone: "+971 56 370 7496", description: "BROKER" },
  { name: "Alessandro Gioia", phone: "+971 58 510 1330", description: "PRIVATE OWNER" },
  { name: "Rami Jawad", phone: "+971 50 801 6869", description: "BROKER" },
  { name: "LUXE TR.CO.LLC", phone: "+971 54 442 0088", description: "CAR DEALERSHIP IN UAE" },
  { name: "Bruno Marchi", phone: "+971 55 525 3224", description: "PRIVATE OWNER" },
  { name: "MBA MOTORS L.L.C", phone: "+971 528386598", description: "CAR DEALERSHIP IN UAE" },
  { name: "Rajab Motors LLC", phone: "+971 56 669 6335", description: "CAR DEALERSHIP IN UAE" },
  { name: "Abdallah", phone: "+971 54 400 4418", description: "PRIVATE OWNER" },
  { name: "Mo Sart", phone: "+971 58 642 4545", description: "PRIVATE OWNER" },
  { name: "HOT WHEEL USED MOTORS", phone: "+971 55 578 1902", description: "CAR DEALERSHIP IN UAE" },
  { name: "SPEEDBIRD LLC", phone: "+971 50 326 0708", description: "CAR DEALERSHIP IN UAE" },
  { name: "Mohammad Waheed", phone: "+971 54 263 0042", description: "CAR DEALERSHIP IN UAE" },
  { name: "MBA MOTORS", phone: "+971 528386598", description: "CAR DEALERSHIP IN UAE" },
  { name: "Kirill Sergeev", phone: "+971 58 598 3877", description: "BROKER" },
  { name: "GNN Motors", phone: "+971 52 222 2262", description: "CAR DEALERSHIP IN UAE" },
  { name: "Rajesh Dandi", phone: "+971 54 411 6792", description: "PRIVATE OWNER" },
  { name: "Hatem Elias", phone: "+971 50 673 6378", description: "BROKER" },
  { name: "Motorworks", phone: "+971 50 626 2526", description: "CAR DEALERSHIP IN UAE" },
  { name: "Hisham Al Naddaf Jaalouk", phone: "+971 56 178 7575", description: "BROKER" },
  { name: "Mo Puri", phone: "+971 52 922 1221", description: "BROKER" },
  { name: "Million Miles", phone: "+971 58 540 0307", description: "CAR DEALERSHIP IN UAE" },
  { name: "Zaur Samadzada", phone: "+971 543030000", description: "PRIVATE OWNER" },
  { name: "OMAR", phone: "+971 56 456 5537", description: "BROKER" },
  { name: "PRIVATE", phone: "+971 52 999 8880", description: "PRIVATE OWNER" },
  { name: "AL WARQA", phone: "+971 52 876 5432", description: "CAR DEALERSHIP IN UAE" },
  { name: "Shahad Mohammed", phone: "+971 50 959 2000", description: "PRIVATE OWNER" },
  { name: "VADIK", phone: "+971 52 722 6297", description: "DEALER" },
  { name: "Auto Max Cars", phone: "+971 58 880 0888", description: "PRIVATE OWNER" },
  { name: "Tarek H", phone: "+971 55 224 1595", description: "PRIVATE OWNER" },
  { name: "Alexandr Kovtunets", phone: "+971 56 609 1986", description: "BROKER" },
  { name: "99 Motors", phone: "+971 56 706 6999", description: "CAR DEALERSHIP IN UAE" },
  { name: "Al Qersh Used Cars", phone: "+971 50 804 7130", description: "CAR DEALERSHIP IN UAE" },
  { name: "Maksat Begliyew", phone: "+971 52 960 7225", description: "BROKER" },
  { name: "ap luxury supercar TRN", phone: "+971 50 839 9314", description: "CAR DEALERSHIP IN UAE" },
  { name: "BELHASA USED CAR", phone: "+971 588941657", description: "CAR DEALERSHIP IN UAE" },
  { name: "AL FAYEZ MOTORS", phone: "+971 586647686", description: "CAR DEALERSHIP IN UAE" },
  { name: "niko", phone: "+971 56 504 8856", description: "BROKER" },
  { name: "Ali Almalek", phone: "+971 58 274 6858", description: "PRIVATE OWNER" },
  { name: "Al Weam Used", phone: "+971 50 927 5502", description: "CAR DEALERSHIP IN UAE" },
  { name: "YAN", phone: "+971 52 588 6666", description: "BROKER" },
  { name: "Yevgeniya Ostra", phone: "+971 52 867 9988", description: "BROKER" },
  { name: "Elijah Petukhov", phone: "+971 55 420 2177", description: "BROKER" },
  { name: "علي محمد", phone: "+971 50 995 9925", description: "PRIVATE OWNER" },
  { name: "66 Motors", phone: "+971 56 999 9999", description: "CAR DEALERSHIP IN UAE" },
  { name: "Asas Motors", phone: "+971 50 860 7675", description: "CAR DEALERSHIP IN UAE" },
  { name: "AL SOFARAA", phone: "+971 52 988 2076", description: "CAR DEALERSHIP IN UAE" },
  { name: "ALVARO LAGO", phone: "+971 55 825 5465", description: "BROKER" },
  { name: "Sultan PK", phone: "+971 58 698 2023", description: "PRIVATE OWNER" },
  { name: "DXB AE", phone: "+971 553307873", description: "BROKER" },
  { name: "Qurtuba Motors", phone: "+971 55 114 1734", description: "CAR DEALERSHIP IN UAE" },
  { name: "Hassan Mohamed", phone: "+971 52 781 2917", description: "BROKER" },
  { name: "Ahmad Ramadan", phone: "+971 507822638", description: "DEALER" },
  { name: "The Dealer's Point", phone: "+971 52 449 1019", description: "CAR DEALERSHIP IN UAE" },
  { name: "Farhaan Ayob", phone: "+971 50 137 8613", description: "DEALER" },
  { name: "CAR ZOO", phone: "+971 52 104 7172", description: "CAR DEALERSHIP IN UAE" },
  { name: "Nicolas", phone: "+971 52 533 9244", description: "WORKS IN SBX CARS [ SUPERCARS BLONDIE]" },
  { name: "FLY WHEELS", phone: "+971 55 847 7763", description: "CAR DEALERSHIP IN UAE" },
  { name: "4 Matic Motors", phone: "+971 54 578 8000", description: "CAR DEALERSHIP IN UAE" },
  { name: "Auto Bank Used Cars", phone: "+971 54 993 7999", description: "CAR DEALERSHIP IN UAE" },
  { name: "EXPRESS MOTORS", phone: "+971 504379279", description: "CAR DEALERSHIP IN UAE" },
  { name: "AASHIR SAUDAGAR", phone: "+971 54 444 8181", description: "DEALER" },
  { name: "Ahmed Mohammad", phone: "+971 56 784 0006", description: "PRIVATE OWNER" },
  { name: "Quatro Motors", phone: "+971 50 670 4904", description: "CAR DEALERSHIP IN UAE" },
  { name: "DAYTONA MOTORS", phone: "+971 54 299 9909", description: "CAR DEALERSHIP IN UAE" },
  { name: "AL TAJ USED", phone: "+971 565869960", description: "CAR DEALERSHIP IN UAE" },
  { name: "AYOON AL HOOT USED", phone: "+971 56 180 0013", description: "CAR DEALERSHIP IN UAE" },
  { name: "Al Faras Al Thahabi Used", phone: "+971 56 335 7777", description: "CAR DEALERSHIP IN UAE" },
  { name: "Michelle Le Blanc", phone: "+971 55 323 3992", description: "PRIVATE OWNER" },
  { name: "ZEUS MOTORS - FZCO", phone: "+971 58 831 4679", description: "CAR DEALERSHIP IN UAE" },
  { name: "Drivenchy Motors", phone: "+971 0507400644", description: "CAR DEALERSHIP IN UAE" },
  { name: "Al Ketbi Motors", phone: "+971 52 300 2007", description: "CAR DEALERSHIP IN UAE" },
  { name: "Diamond Class Motors", phone: "+971 50 769 1054", description: "CAR DEALERSHIP IN UAE" },
  { name: "MANGAME MOTORS FZE", phone: "+971 58 888 8689", description: "CAR DEALERSHIP IN UAE" },
  { name: "BAIT AL KRUTII USED", phone: "+971 54 279 4829", description: "CAR DEALERSHIP IN UAE" },
  { name: "Al Muwafaq Motors", phone: "+971 0564830332", description: "CAR DEALERSHIP IN UAE" },
  { name: "MASTER GALLERY", phone: "+971 54 233 8822", description: "CAR DEALERSHIP IN UAE" },
  { name: "ADAM LUXURY CARS L.L.C-FZ", phone: "+971 50 303 3008", description: "CAR DEALERSHIP IN UAE" },
  { name: "Park Lane Motors", phone: "+971 48156503", description: "CAR DEALERSHIP IN UAE" },
  { name: "RMA Motors", phone: "+971 48219706", description: "CAR DEALERSHIP IN UAE" },
  { name: "MILAN MOTORS", phone: "+971 55 855 8222", description: "CAR DEALERSHIP IN UAE" },
  { name: "STAR COLLECTION", phone: "+971 55 651 5055", description: "CAR DEALERSHIP IN UAE" },
  { name: "Alrawi Auto Auction -", phone: "+971 55 170 7268", description: "CAR DEALERSHIP IN UAE" },
  { name: "DEALER", phone: "+971 58 585 3861", description: "DEALER" },
  { name: "Nadeem Farooqui", phone: "+971 50 467 8201", description: "BROKER" },
  { name: "Mr T", phone: "+971 50 919 9505", description: "BROKER" },
  { name: "Silber Arrows 1934 Used", phone: "+971 56 404 0760", description: "CAR DEALERSHIP IN UAE" },
  { name: "Keno Cars L.L.C-FZ", phone: "+971 58 985 9886", description: "CAR DEALERSHIP IN UAE" },
  { name: "CARBAY", phone: "+971 58 926 9911", description: "CAR DEALERSHIP IN UAE" },
  { name: "Al Bassam Used Motors", phone: "+971 50 653 1700", description: "CAR DEALERSHIP IN UAE" },
  { name: "Drive to Deliver Motors Used Luxury", phone: "+971 55 150 6323", description: "CAR DEALERSHIP IN UAE" },
  { name: "Alpha motors LLC", phone: "+971 56 916 0601", description: "CAR DEALERSHIP IN UAE" },
  { name: "Dream Car Auto", phone: "+971 50 300 3138", description: "CAR DEALERSHIP IN UAE" },
  { name: "SPECIAL DEAL USED", phone: "+971 56 234 1000", description: "CAR DEALERSHIP IN UAE" },
  { name: "Lindas Motors", phone: "+971 4 510 9400", description: "CAR DEALERSHIP IN UAE" },
  { name: "Endurance Motors", phone: "+971 50 524 6969", description: "CAR DEALERSHIP IN UAE" },
  { name: "MOTOR EXPERTS CAR", phone: "+971 58 905 3043", description: "CAR DEALERSHIP IN UAE" },
  { name: "Oscar luxury Auto", phone: "+971 50 400 4007", description: "CAR DEALERSHIP IN UAE" },
  { name: "Al Qassim Used Cars", phone: "+971 56 123 0006", description: "CAR DEALERSHIP IN UAE" },
  { name: "Nice Cars Trading", phone: "+971 50 279 9309", description: "CAR DEALERSHIP IN UAE" },
  { name: "P 2 P Motors", phone: "+971 52 877 7815", description: "CAR DEALERSHIP IN UAE" },
  { name: "Gareth Gregory", phone: "+971 55 324 9251", description: "PRIVATE OWNER" },
  { name: "Bilal Qurabash", phone: "+971 55 555 9169", description: "BROKER" },
  { name: "Hamza Raza Malik", phone: "+971 54 351 1911", description: "BROKER" },
  { name: "M", phone: "+971 54 747 4749", description: "BROKER" },
  { name: "Sharif El-Badawi", phone: "+971 52 562 3962", description: "PRIVATE OWNER" },
  { name: "Rashid alfalasi", phone: "+971 52 277 7734", description: "PRIVATE OWNER" },
  { name: "Thierry", phone: "+971 52 942 2221", description: "PRIVATE OWNER" },
  { name: "Rashid Lootah", phone: "+971 50 708 8885", description: "PRIVATE OWNER" },
  { name: "Mohammed Al Ali", phone: "+971 58 555 2222", description: "PRIVATE OWNER" },
  { name: "Rabo K", phone: "+971 52 362 1337", description: "PRIVATE OWNER" },
  { name: "PRIVATE", phone: "+971 50 855 7342", description: "PRIVATE OWNER" },
  { name: "KINGLY POINT AUTO ACCESSORIES", phone: "+971 56 503 5100", description: "DEALER" },
  { name: "Ahmad Almutawa", phone: "+971 50 155 5506", description: "PRIVATE OWNER" },
  { name: "BIG MOTORS - L.L.C", phone: "+971 50 668 6691", description: "CAR DEALERSHIP IN UAE" },
  { name: "Yaniv Danon", phone: "+971 58 590 2852", description: "PRIVATE OWNER" },
  { name: "mohanad Elwadia", phone: "+971 506555800", description: "PRIVATE OWNER" },
  { name: "Ruediger Geckler", phone: "+971 58 550 1684", description: "PRIVATE OWNER" },
  { name: "B12 AUCTIONS", phone: "+971 50 784 4434", description: "CAR DEALERSHIP IN UAE" },
  { name: "PRIVATE", phone: "+971 55 910 7104", description: "PRIVATE OWNER" },
  { name: "Abdulla", phone: "+971 55 659 1991", description: "PRIVATE OWNER" },
  { name: "QUALID", phone: "+49 1575 4041031", description: "HIS FAMILY MEMBER OWNS A DEALER SHIP" },
  { name: "SABURI", phone: "+49 176 84227936", description: "HE OWNS A LARGE DEALER IN GERMANY" },
  { name: "ALI AKBARI", phone: "+49 15510 376605", description: "HE IS THE PARTNER OF SABURI" },
  { name: "WALTON", phone: "+49 1512 0194352", description: "HE works as an enginner in a dealer but he opened one" },
  { name: "ELIEL", phone: "+358 40 0186049", description: "HE IS A BROKER HE IS NOW INTO DOING CAR DESIGNS" },
  { name: "BRUNO", phone: "+33 6 98 44 61 29", description: "HE IS A BROKER" },
  { name: "DEALER", phone: "+971 55 512 7412", description: "HE OWNS A DEALERSHIP IN DUBAI" },
  { name: "DEALER", phone: "+49 173 7373208", description: "HE OWNS A DEALER IN EU" },
  { name: "MALIK", phone: "+49 173 4680201", description: "HE IS A CRYPTO GUY" },
  { name: "AKULA", phone: "+371 29 918 640", description: "HE IS A BROKER" },
  { name: "ALI", phone: "+973 3223 3735", description: "HE IS A BROKER" },
  { name: "ALI", phone: "+49 173 3000003", description: "HE OWNS A DEALERSHIP IN GERMANY" },
  { name: "ANTON BRUMMER", phone: "+49 174 1411118", description: "HE WORKS FOR A DEALER IN GERMANY" },
  { name: "ARNUAD", phone: "+32 488 59 86 16", description: "HE IS A BROKER" },
  { name: "AUTO 1000", phone: "+49 176 63032725", description: "DEALERSHIP IN EU" },
  { name: "DEALER", phone: "+49 176 21617956", description: "HE IS A DEALER IN GERMANY" },
  { name: "HAMIDO", phone: "+971 52 726 5443", description: "HE WORKS FOR AUTO DEALS IN DUBAI" },
  { name: "DEALER", phone: "+49 160 94404470", description: "A DEALER IN EU" },
  { name: "DEALER", phone: "+49 170 1223307", description: "A DEALER IN EU" },
  { name: "DEALER", phone: "+971 54 482 0694", description: "A DEALER IN DUBAI" },
  { name: "BASTI B", phone: "+49 1516 4964934", description: "A DEALER IN EU" },
  { name: "SELECTED MOTORS", phone: "+421 905 611 082", description: "A DEALER IN EU" },
  { name: "CAMILLE", phone: "+31 6 42420582", description: "HE WORKS FOR A BIG DEALER IN NETHERLANDS" },
  { name: "CAR LINK", phone: "+31 88 091 1911", description: "DEALER IN EU" },
  { name: "CARTELIER 22", phone: "+49 173 4782050", description: "DEALER IN EU" },
  { name: "CC", phone: "+49 171 7343213", description: "WORKS FOR CC IN GERMANY" },
  { name: "DEALER", phone: "+49 179 4880885", description: "HE IS A DEALER IN GERMANY HE IS TOO OPEN FOR EVERYTHING" },
  { name: "CHRISTOPHE VIONNET", phone: "+33 6 48 10 11 18", description: "A BROKER IN EU" },
  { name: "CELTA SCHWAB", phone: "+49 1522 1862228", description: "SHE WORKS FOR HERCEG MOTORS" },
  { name: "PRIVATE GUY", phone: "+44 7508 573317", description: "HE WORKS IN CRYPTO,OIL ETC…" },
  { name: "CWS", phone: "+49 1512 1519699", description: "A BROKERAGE COMPANY IN GERMANY" },
  { name: "PRIVATE GUY", phone: "+420 733 710 798", description: "OWNS A VERY LARGE COLLECTION OF CARS [ SP1,SP2 ETC..]" },
  { name: "MKZ", phone: "+971 52 892 0850", description: "HE IS A BROKER IN UAE AND SUADI ARABIA" },
  { name: "DIRK VOIGT", phone: "+49 171 6900919", description: "OWNS A VERY LARGE COLLECTION OF CARS" },
  { name: "DEALER", phone: "+370 669 54750", description: "OWNS A RENTING COMPANY IN EU" },
  { name: "EXECUTIVE ENGINES", phone: "+420 736 296 128", description: "A DEALERSHIP IN EU" },
  { name: "EXOTIC INTERNATIONAL", phone: "+49 173 3237198", description: "A DEALERSHIP IN EU" },
  { name: "FABIAN", phone: "+49 1515 5833614", description: "A BROKER IN EU" },
  { name: "FABIAN", phone: "+48 572 412 290", description: "ANOTHER BROKER IN EU" },
  { name: "FARIZ", phone: "+971 55 855 4488", description: "CAR DEALER IN DUBAI" },
  { name: "ferhat", phone: "+49 1517 2448930", description: "CAR DEALER IN EU" },
  { name: "FIRST CLASS MOTORS", phone: "+49 1525 6907492", description: "CAR DEALER IN EU" },
  { name: "FS", phone: "+420 776 388 225", description: "CAR DEALER IN EU" },
  { name: "PRIVATE GUY", phone: "+49 176 32661496", description: "OWNS A COLLECTION AND DO BROKERAGE" },
  { name: "GENIUS DEL NOLO SA", phone: "+32 492 50 01 91", description: "CAR BROKERAGE COMPANY" },
  { name: "HADI", phone: "+971 58 882 0221", description: "CAR BROKER" },
  { name: "HAMAD", phone: "+971 50 300 7300", description: "OWNS A DEALER IN DUBAI" },
  { name: "HLF CARS", phone: "+49 162 8888780", description: "DEALER IN EU" },
  { name: "HOUSE OF SUPER CARS", phone: "+41 79 128 27 35", description: "BROKERAGE COMPANY" },
  { name: "HUMAID", phone: "+971 50 481 0004", description: "CAR BROKER IN UAE" },
  { name: "IBRAHIM", phone: "+965 9907 3214", description: "CAR BROEKR" },
  { name: "INFLUENCE AGENCY", phone: "+39 351 708 6020", description: "CAR BROKER" },
  { name: "ITA CARS", phone: "+48 603 625 435", description: "CAR DEALER" },
  { name: "GARY", phone: "+971 58 128 1296", description: "CAR BROKER" },
  { name: "MOHAMAD", phone: "+971 58 179 4945", description: "CAR BROKER" },
  { name: "MOHAMAD", phone: "+971 50 377 0377", description: "CAR BROKER" },
  { name: "LAYTH", phone: "+971 54 993 7999", description: "CAR DEALER" },
  { name: "WILLIAM", phone: "+33 6 83 26 62 56", description: "CAR BROKER" },
  { name: "WILL", phone: "+44 7956 258746", description: "CAR BROKER" },
  { name: "WILFRIED HALLIER", phone: "+49 172 4001100", description: "CAR DEALER" },
  { name: "KOENIGSEGG DEALER", phone: "+49 1512 3070337", description: "CAR DEALER" },
  { name: "UZAIR ZUBAIR", phone: "+44 7770 099720", description: "CAR BROKER" },
  { name: "LORINCZI", phone: "+36 70 204 4555", description: "BROKERAGE COMPANY" },
  { name: "LUC", phone: "+65 8333 0905", description: "CAR BROKER, SON OF A MILLIONARE" },
  { name: "MARICN", phone: "+48 574 229 760", description: "CONTROL MULTIPAL COMPANYS IN POLAND FOR CARS" },
  { name: "MARCO", phone: "+49 1522 3095582", description: "CAR DEALER" },
  { name: "MAREK", phone: "+48 574 230 999", description: "CAR BROKER" },
  { name: "MARIUS", phone: "+971 58 900 0980", description: "CAR DEALER IN UAE" },
  { name: "MICHAEL", phone: "+49 179 7378827", description: "CAR DEALER IN GERMANY" },
  { name: "MICHAEL ALBRECHT", phone: "+49 179 3455485", description: "CAR DEALER" },
  { name: "MKZ", phone: "+971 52 751 8888", description: "CAR BROKER IN DUBAI AND SUADI ARABIA" },
  { name: "MM GMBH", phone: "+49 172 7276069", description: "CAR DEALER" },
  { name: "MM22", phone: "+49 172 4592434", description: "CAR DEALER IN GERMANY" },
  { name: "MR MO", phone: "+971 56 987 9778", description: "CAR BROKER IN UAE" },
  { name: "NEZNAMY", phone: "+420 736 777 777", description: "ECONOMY CAR DEALER IN CZECH REPUBLIC" },
  { name: "NIZAR ALBALUSHI", phone: "+971 56 397 4071", description: "PRIVATE OWNER" },
  { name: "NOMAUTO", phone: "+39 347 917 4552", description: "CAR BROKER" },
  { name: "PK", phone: "+49 1511 2130066", description: "OWNS CAR COLLECTION [PRIVATE GUY]" },
  { name: "CAR DEALER", phone: "+974 5586 2222", description: "CAR DEALER" },
  { name: "RICHY", phone: "+34 673 08 47 93", description: "DEALES IN CRYPTO, TRAVELS A LOT" },
  { name: "RENE", phone: "+49 1522 6202805", description: "BROKER IN EU" },
  { name: "RIZWAN", phone: "+971 55 845 0222", description: "CAR BROKER" },
  { name: "ROCKY AJ", phone: "+971 58 599 6685", description: "BROKER IN UAE" },
  { name: "ROUSLAN", phone: "+49 175 2560089", description: "CAR DEALER" },
  { name: "RUBEN", phone: "+32 468 27 66 39", description: "DON'T KNOW" },
  { name: "SERGIUS SEREDIN", phone: "+49 173 3650513", description: "OWNS A DEALER IN EU" },
  { name: "SHAY", phone: "+44 7944 305469", description: "CAR BROKER" },
  { name: "SIANA KORAL", phone: "+49 176 70492087", description: "WORKS IN A DEALER OWNED BY SABURI" },
  { name: "SIVO", phone: "+49 1520 7770071", description: "CAR BROKER" },
  { name: "STEFAN", phone: "+39 378 089 8868", description: "CAR BROKER" },
  { name: "SUPER CARS FOR SALE", phone: "+44 7404 540225", description: "CAR BROKERAGE COMPANY" },
  { name: "S Y", phone: "+971 50 302 8022", description: "CAR DEALER IN UAE" },
  { name: "SZENTE", phone: "+36 30 422 6647", description: "CAR BROKER" },
  { name: "FIST GEAR", phone: "+34 688 62 51 57", description: "BROKER" },
  { name: "THOMAS", phone: "+49 176 77727777", description: "DEALER" },
  { name: "TOBIAS", phone: "+49 176 60173457", description: "DON'T KNOW" },
  { name: "TU", phone: "+216 21 191 215", description: "A BROKER" },
  { name: "CAR BODENSEE", phone: "+49 173 8578860", description: "CAR DEALERSHIP" },
  { name: "ASKHAB", phone: "+971 58 501 7787", description: "CAR RENTAL" },
  { name: "APK", phone: "+49 174 3961111", description: "CAR DEALER" }
];

interface Contact {
  name: string;
  phone: string;
  description: string;
  category?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Contact[]>([]);
  const [filteredData, setFilteredData] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Process business data on component mount
  const processedData = businessData.map(contact => ({
    ...contact,
    category: classifyBusiness(contact)
  }));
  
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
    country: "all"
  });


  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    let filtered = data.length > 0 ? data : processedData;
    
    if (newFilters.category !== "all") {
      filtered = filtered.filter(contact => contact.category === newFilters.category);
    }
    
    if (newFilters.search) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        contact.phone.includes(newFilters.search) ||
        contact.description.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }
    
    if (newFilters.country !== "all") {
      filtered = filtered.filter(contact => {
        if (newFilters.country === "uae") return contact.phone.startsWith("+971");
        if (newFilters.country === "qatar") return contact.phone.startsWith("+974");
        if (newFilters.country === "eu") return !contact.phone.startsWith("+971") && !contact.phone.startsWith("+974");
        return true;
      });
    }
    
    setFilteredData(filtered);
  };

  // Enhanced filter handler for FilterPanel
  const handleAdvancedFilterChange = (newFilters: Record<string, any>) => {
    let filtered = data.length > 0 ? data : processedData;
    
    // Apply each filter
    Object.keys(newFilters).forEach(column => {
      const filterValue = newFilters[column];
      
      if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
        filtered = filtered.filter(contact => {
          const cellValue = contact[column as keyof Contact];
          
          if (typeof filterValue === 'object' && (filterValue.min !== undefined || filterValue.max !== undefined)) {
            // Handle number range filters
            const numValue = parseFloat(cellValue?.toString() || '0');
            if (filterValue.min !== undefined && numValue < filterValue.min) return false;
            if (filterValue.max !== undefined && numValue > filterValue.max) return false;
            return true;
          } else {
            // Handle text filters
            return cellValue?.toString().toLowerCase().includes(filterValue.toString().toLowerCase());
          }
        });
      }
    });
    
    setFilteredData(filtered);
  };

  const resetFilters = () => {
    setFilters({ category: "all", search: "", country: "all" });
    setFilteredData(data.length > 0 ? data : processedData);
  };

  const displayData = data.length > 0 ? filteredData : processedData;
  
  return (
    <div className="min-h-screen bg-gradient-background" style={{ backgroundImage: `url(${customBG})` }}>
      {/* Colorful Header */}
      <div className="bg-[#555179] text-white shadow-colorful">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="uppercase tracking-wide font-semibold text-white px-8 py-3 rounded-lg bg-[#202328] shadow-lg hover:bg-[#2a2d33] transition duration-300"

              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              
              <div className="flex items-center gap-4">
                
                <div>
                  <h1 className="text-3xl font-bold">LuxLeads Dashboard</h1>
                  <p className="text-white/80">Manage your luxury business contacts with style</p>
                </div>
              </div>
            </div>
            {/* className="uppercase tracking-wide font-semibold text-white px-8 py-3 rounded-lg bg-[#202328] shadow-lg hover:bg-[#2a2d33] transition duration-300"
 */}
            <Badge variant="secondary" className="bg-[#202328] shadow-lg hover:bg-[#2a2d33] px-2 py-2 text-white border-white/30 animate-float">
              {displayData.length} contacts loaded
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">


      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-card shadow-soft rounded-xl p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#202328] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-[#202328] data-[state=active]:text-white">
            Data Table
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-[#202328] data-[state=active]:text-white">
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-slate-800/50 shadow-soft border-0 animate-scale-in">
              <CardHeader>
                <CardTitle className="text-center bg-white bg-clip-text text-transparent">
                  Filter Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterPanel
                  columns={['name', 'phone', 'description', 'category']}
                  data={displayData}
                  onFilterChange={handleAdvancedFilterChange}
                />
              </CardContent>
            </Card>
            
            <div className="md:col-span-2">
              <CategoryStats data={displayData} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4 animate-fade-in">
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader className="bg-[#1b2030] rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Contact Data</CardTitle>
                <Badge variant="outline" className="bg-white/50 border-secondary-foreground/20">
                  {displayData.length} contacts
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <DataTable 
                data={displayData}
                columns={displayData.length > 0 ? Object.keys(displayData[0]) : []}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4 animate-fade-in">
          <Card className="bg-gradient-card shadow-colorful border-0 text-center p-8">
            <CardHeader>
              <CardTitle className="text-2xl bg-[#1b2030] bg-clip-text text-transparent mb-4">
                Export Your Data
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Download your contact data in your preferred format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportButton 
                data={displayData}
                filename="luxleads-contacts"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
