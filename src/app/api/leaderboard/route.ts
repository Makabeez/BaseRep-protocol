import { NextResponse } from 'next/server';

const EAS_GRAPHQL_URL = 'https://base.easscan.org/graphql';
const SCHEMA_UID = '0x9f680f50ebed1dc06b17b9a5461ee44496fae9b5e82b985634353f9c7054085e';

export async function GET() {
  try {
    const query = `
      query GetAttestations($schemaId: String!) {
        attestations(where: { schemaId: { equals: $schemaId } }, orderBy: [{ timeCreated: desc }], take: 100) {
          recipient
          decodedDataJson
          timeCreated
        }
      }
    `;

    const response = await fetch(EAS_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { schemaId: SCHEMA_UID },
      }),
      next: { revalidate: 60 } // Cache results for 60 seconds to keep it fast
    });

    const { data } = await response.json();

    if (!data || !data.attestations) {
      return NextResponse.json({ leaderboard: [], recent: [] });
    }

    const processedData = data.attestations.map((att: any) => {
      let rank = 'VERIFIED';
      let points = 0;
      
      try {
        const decoded = JSON.parse(att.decodedDataJson);
        const rankData = decoded.find((d: any) => d.name === 'rank');
        const pointsData = decoded.find((d: any) => d.name === 'points');
        
        if (rankData) rank = rankData.value.value || rankData.value;
        if (pointsData) {
          // Handle BigNumber hex format from EAS or standard numbers
          const rawPoints = pointsData.value.value || pointsData.value;
          points = typeof rawPoints === 'object' && rawPoints.hex ? parseInt(rawPoints.hex, 16) : Number(rawPoints);
        }
      } catch (e) {
        console.error("Error decoding EAS JSON data", e);
      }

      // Generate a deterministic fake volume for UI purposes based on the address
      const pseudoRandom = parseInt(att.recipient.slice(2, 6), 16);
      const fakeVolume = `$${(pseudoRandom * 15 + 10000).toLocaleString('en-US')}`;

      // Format time elapsed
      const timeDiffMs = Date.now() - (att.timeCreated * 1000);
      const minutesAgo = Math.floor(timeDiffMs / 60000);
      const timeString = minutesAgo < 60 ? `${minutesAgo} mins ago` : 
                         minutesAgo < 1440 ? `${Math.floor(minutesAgo/60)} hours ago` : 
                         `${Math.floor(minutesAgo/1440)} days ago`;

      return {
        address: `${att.recipient.slice(0, 5)}...${att.recipient.slice(-4)}`,
        fullAddress: att.recipient,
        rank,
        score: points,
        time: timeString,
        volume: fakeVolume
      };
    });

    // Extract Top 5 for Leaderboard
    const leaderboard = [...processedData]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((user, index) => ({ ...user, rankPos: index + 1 }));

    // Extract Top 3 most recent for Live Feed
    const recent = processedData.slice(0, 3);

    return NextResponse.json({ leaderboard, recent });
  } catch (error) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json({ leaderboard: [], recent: [] }, { status: 500 });
  }
}
