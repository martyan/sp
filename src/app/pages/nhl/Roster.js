import React from 'react'
import { getStats } from './TeamFeed'

const sortByTOI = (roster) => {
    return roster.sort((a, b) => {
        const statsA = getStats('statsSingleSeason', a.person.stats)
        const statsB = getStats('statsSingleSeason', b.person.stats)
        if(!statsA) return 1
        if(!statsB) return -1

        const [ mA, sA ] = statsA.timeOnIce.split(':').map(stat => parseInt(stat))
        const [ mB, sB ] = statsB.timeOnIce.split(':').map(stat => parseInt(stat))
        const totalA = mA * 60 + sA
        const totalB = mB * 60 + sB

        if(totalA < totalB) return 1
        if(totalA > totalB) return -1

        return 0
    })
}

const sortByPoints = (roster) => {
    return roster.sort((a, b) => {
        const statsA = getStats('statsSingleSeason', a.person.stats)
        const statsB = getStats('statsSingleSeason', b.person.stats)
        if(!statsA || !statsA.goals || !statsA.assists) return 1
        if(!statsB || !statsB.goals || !statsB.assists) return -1

        const pA = statsA.goals + statsA.assists
        const pB = statsB.goals + statsB.assists

        if(pA < pB) return 1
        if(pA > pB) return -1

        return 0
    })
}

const Roster = ({ roster }) => {
    if(!roster) return null

    // const sorted = sortByTOI(roster)
    const sorted = sortByPoints(roster)
    console.log(sorted)

    return (
        <div className="roster">
            <ul>
                {sorted.map(player => (
                    <li key={player.person.id} className="player" onClick={() => setActivePlayer(player.person.id)}>
                        <div className="avatar">
                            <img className="photo" src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${player.person.id}.jpg`} />
                            {player.teamId && <img className="badge" src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${player.teamId}-dark.svg`} />}
                        </div>
                        <div className="info">
                            <div className="top">
                                <span className="name">{player.person.fullName}</span>
                                <span className="number">#{player.jerseyNumber}</span>
                            </div>
                            <div className="position">{player.position.name}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Roster
