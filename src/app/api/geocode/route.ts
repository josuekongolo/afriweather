import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Africa bounding box (generous)
const AFRICA_VIEWBOX = "-25,-36,55,38";

// All African ISO country codes
const AFRICA_CODES =
  "ZA,BW,ZW,MZ,ZM,MW,NA,LS,SZ,MG,MU,KM,AO,KE,TZ,UG,ET,RW,BI,SS,SO,DJ,ER,SC,NG,GH,SN,CI,ML,BF,NE,GN,SL,LR,TG,BJ,GM,GW,CV,MR,CD,CM,CG,GA,CF,TD,GQ,ST,EG,MA,DZ,TN,LY,SD";

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", q);
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "6");
    url.searchParams.set("countrycodes", AFRICA_CODES);
    url.searchParams.set("viewbox", AFRICA_VIEWBOX);
    url.searchParams.set("bounded", "1");

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "afriweather/1.0 (https://afriweather.com)",
      },
      next: { revalidate: 86400 }, // cache 24h
    });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const data: NominatimResult[] = await res.json();

    const results = data.map((r) => {
      const addr = r.address || {};
      const placeName =
        addr.city || addr.town || addr.village || addr.hamlet || r.display_name.split(",")[0];
      const region = addr.state || addr.county || "";
      const country = addr.country || "";

      return {
        name: placeName,
        region,
        country,
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        displayName: r.display_name,
      };
    });

    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
