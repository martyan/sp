import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createPhoto, getPhoto, uploadFile, getPhotos } from '../lib/app/actions'
import withAuthentication from '../lib/withAuthentication'
import axios from 'axios'
import moment from 'moment'
import PageWrapper from '../components/PageWrapper'
import Modal from '../components/common/Modal'
import './nhl.scss'

const sortTeamsByName = (teams) => {
    return teams.sort((a, b) => {
        if(a.name > b.name) return 1
        if(a.name < b.name) return -1
        return 0
    })
}

const sortPlayersByName = (players) => {
    return players.sort((a, b) => {
        if(a.person.fullName > b.person.fullName) return 1
        if(a.person.fullName < b.person.fullName) return -1
        return 0
    })
}

const Roster = ({ team, onClick }) => {

    if(!team) return null

    const sorted = sortPlayersByName(team.roster.roster)

    return (
        <div className="roster">
            <ul>
                {sorted.map(player => (
                    <li key={player.person.id} onClick={() => onClick(player.person.id)}>
                        <img className="logo" src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${player.person.id}.jpg`} alt=""/>
                        <span>{player.position.abbreviation}</span>
                        <span>{player.jerseyNumber} </span>
                        <span>{player.person.fullName}</span>
                    </li>
                ))}
            </ul>
        </div>
    )

}

const PlayerFeed = ({ playerId, ...props }) => {

    const [ player, setPlayer ] = useState(null)
    const [ feed, setFeed ] = useState([])

    useEffect(() => {
        axios.get(`https://statsapi.web.nhl.com/api/v1/people/${playerId}`)
            .then(response => setPlayer(response.data.people[0]))
            .catch(console.error)

        axios.get(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=gameLog&season=20192020`)
            .then(response => setFeed(response.data.stats[0].splits))
            .catch(console.error)
    }, [])

    // console.log(feed, player)

    if(!player || !feed.length) return null

    return (
        <div className="player-feed">
            {feed.map(game => (
                <div key={game.date} className="game">
                    <div className={game.isHome ? 'teams' : 'teams away'}>
                        <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${game.team.id}-dark.svg`} alt={game.team.name} />
                        <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${game.opponent.id}-dark.svg`} alt={game.opponent.name} />
                    </div>
                    <div className="stats">
                        <span>G{game.stat.goals} A{game.stat.assists}</span>
                        <span className="date">{moment(game.date).format('ddd MMM DD')}</span>
                    </div>
                    {(game.stat.goals > 0 || game.stat.assists > 0) && (
                        <GameFeed
                            gameId={game.game.gamePk}
                            player={player}
                            {...props}
                        />
                    )}
                </div>
            ))}
        </div>
    )

}

const GameFeed = ({ gameId, player, activeMedia, setActiveMedia }) => {

    const [ feed, setFeed ] = useState(null)

    useEffect(() => {
        axios.get(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/content`)
            .then(response => setFeed(response.data))
            .catch(console.error)
    }, [])

    if(!feed) return null

    const media = feed.highlights.scoreboard.items
    const applicableMedia = media.filter(m => m.description.indexOf(player.lastName) > -1)
    // console.log(applicableMedia, player)

    console.log(media)
    return (
        <div className="game-feed">

            {applicableMedia.map(media => {
                if(activeMedia === media.id) {
                    const HQ = media.playbacks.find(pb => pb.name.indexOf('FLASH_1800K') > -1)
                    if(!HQ) return null
                    return <iframe key={HQ.url} src={HQ.url} frameborder="0"></iframe>
                }

                const thumb = media.image.cuts['1024x576']
                if(!thumb) return null
                return <img key={thumb.src} src={thumb.src} onClick={() => setActiveMedia(media.id)}/>
            })}

        </div>
    )

}

// const Video = ({ media }) => {
//
//     const [ inited, setInited ] = useState(false)
//
//     if(inited) {
//         const HQ = media.playbacks.find(pb => pb.name.indexOf('FLASH_1800K') > -1)
//         if(!HQ) return null
//         return <iframe src={HQ.url} frameBorder="0"></iframe>
//     }
//
//     const thumb = media.image.cuts['1024x576']
//     if(!thumb) return null
//     return <img src={thumb.src} onClick={() => setInited(true)}/>
//
// }

const NHLgram = ({ user }) => {

    const [ teams, setTeams ] = useState([])
    const [ activeTeam, setActiveTeam ] = useState(null)
    const [ activePlayer, setActivePlayer ] = useState(null)
    const [ activeMedia, setActiveMedia ] = useState(null)

    useEffect(() => {
        axios.get('https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster')
            .then(response => setTeams(sortTeamsByName(response.data.teams)))
            .catch(console.error)

        setActivePlayer(8477956)
    }, [])

    const team = teams.find(team => team.id === activeTeam)

    console.log(teams)

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl">

                <ul className="teams">
                    {teams.map(team => (
                        <li key={team.id} onClick={() => setActiveTeam(team.id)}>
                            <img className="logo" src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${team.id}-dark.svg`} alt=""/>
                            <span className="name">{team.name}</span>
                        </li>
                    ))}
                </ul>

                <Modal
                    visible={activeTeam !== null}
                    onClose={() => setActiveTeam(null)}
                    classNames={{modal: 'nhl no-padding', overlay: 'no-padding'}}
                    noPadding
                >
                    <Roster
                        team={team}
                        onClick={setActivePlayer}
                    />
                </Modal>

                <Modal
                    visible={activePlayer !== null}
                    onClose={() => setActivePlayer(null)}
                    classNames={{modal: 'nhl no-padding', overlay: 'no-padding'}}
                    noPadding
                >
                    <PlayerFeed
                        playerId={activePlayer}
                        activeMedia={activeMedia}
                        setActiveMedia={setActiveMedia}
                    />
                </Modal>

            </div>
        </PageWrapper>
    )

}

NHLgram.getInitialProps = async ({ store }) => {
    await store.dispatch(getPhotos())
    return {}
}

NHLgram.propTypes = {
    createPhoto: PropTypes.func.isRequired,
    getPhoto: PropTypes.func.isRequired,
    getPhotos: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    user: PropTypes.object
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    photos: [...state.app.photos, ...state.app.photos, ...state.app.photos, ...state.app.photos, ...state.app.photos]
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        createPhoto,
        getPhoto,
        getPhotos,
        uploadFile
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(NHLgram)
