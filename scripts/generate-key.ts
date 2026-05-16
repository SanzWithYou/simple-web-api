import { V4 } from 'paseto'

const main = async () => {
  const access = await V4.generateKey('public', { format: 'paserk' })

  console.log('\n=== ACCESS TOKEN KEYS ===')
  console.log(`ACCESS_TOKEN_SECRET=${access.secretKey}`)
  console.log(`ACCESS_TOKEN_PUBLIC=${access.publicKey}`)

  const refresh = await V4.generateKey('public', { format: 'paserk' })

  console.log('\n=== REFRESH TOKEN KEYS ===')
  console.log(`REFRESH_TOKEN_SECRET=${refresh.secretKey}`)
  console.log(`REFRESH_TOKEN_PUBLIC=${refresh.publicKey}`)
  console.log()
}

main().catch(console.error)
