import { Router } from 'express'
import { Connection } from 'typeorm'
import { validate } from 'class-validator'
import httpStatus from 'http-status-codes'
import { getDb } from '../../database'
import { buildChainlinkNode, ChainlinkNode } from '../../entity/ChainlinkNode'
import { PostgresErrorCode } from '../../utils/constants'
import { isPostgresError } from '../../utils/errors'
const router = Router()

router.post('/nodes', async (req, res) => {
  const name = req.body.name
  const url = req.body.url
  const db = await getDb()
  const [node, secret] = await buildChainlinkNode(db, name, url)
  const errors = await validate(node)

  if (errors.length === 0) {
    try {
      const savedNode = await db.manager.save(node)

      return res.status(httpStatus.CREATED).json({
        id: savedNode.id,
        accessKey: savedNode.accessKey,
        secret: secret,
      })
    } catch (e) {
      if (
        isPostgresError(e) &&
        e.code === PostgresErrorCode.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return res.sendStatus(httpStatus.CONFLICT)
      }

      console.error(e)
      return res.sendStatus(httpStatus.BAD_REQUEST)
    }
  }

  const jsonApiErrors = errors.reduce(
    (acc, e) => ({ ...acc, [e.property]: e.constraints }),
    {},
  )

  return res
    .status(httpStatus.UNPROCESSABLE_ENTITY)
    .send({ errors: jsonApiErrors })
})

router.delete('/nodes/:name', async (req, res) => {
  const db: Connection = await getDb()

  await db.getRepository(ChainlinkNode).delete({ name: req.params.name })

  return res.sendStatus(httpStatus.OK)
})

export default router
