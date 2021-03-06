/** @jsx jsx */
import { useState } from 'react'
import PropTypes from 'prop-types'
import { Styled, jsx } from 'theme-ui'
import { Grid } from '@theme-ui/components'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import Close from '../../images/close.svg'

const UPLOAD_IMAGE = gql`
  mutation uploadImage($image: File!) {
    uploadImage(image: $image) @client
  }
`

const UploadImage = ({ isLoading, setValue }) => {
  const [image, setImage] = useState('')
  const [uploadImage, { loading }] = useMutation(UPLOAD_IMAGE, {
    onError: error => {
      console.error('Error uploading image to IPFS: ', error)
    },
    onCompleted: data => {
      if (data) {
        setImage(data.uploadImage)
      }
    },
  })

  const handleUpload = async (e, field) => {
    // TODO: Hook up the mutation
    const image = e.target.files[0]
    uploadImage({ variables: { image } })
  }

  const removeImage = e => {
    e.preventDefault()
    e.stopPropagation()
    setImage('')
  }

  return (
    <label
      sx={
        image
          ? {
              ...styles.label,
              border: 'none',
              backgroundColor: 'white',
              width: '100%',
              pr: 3,
            }
          : {
              ...styles.label,
              width: '100%',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'whiteFaded',
              },
            }
      }
    >
      <input
        sx={styles.input}
        name="upload-image"
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />
      {image ? (
        <Grid sx={styles.grid} gap={0}>
          <img
            src={`${process.env.GATSBY_IPFS_HTTP_URI}/api/v0/cat?arg=${image}`}
            sx={{
              height: '64px',
              width: '64px',
              position: 'relative',
              objectFit: 'contain',
            }}
            alt="Token logo"
          />
          <Close
            alt="Close"
            sx={{
              transform: 'rotate(90deg)',
              fill: 'secondary',
              position: 'absolute',
              right: 4,
              top: 0,
              bottom: 0,
              margin: 'auto',
              width: '16px',
              height: '16px',
              padding: 1,
            }}
            onClick={removeImage}
          />
        </Grid>
      ) : (
        <Grid
          sx={{
            gridTemplateColumns: 'max-content max-content',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 1s ease',
          }}
          gap={2}
        >
          <p sx={{ variant: 'large' }}>
            {isLoading ? 'Uploading' : 'Upload image'}
          </p>
          {isLoading && (
            <img
              src="/loading-dots.gif"
              alt="Uploading"
              sx={{ height: '24px', width: 'auto' }}
            />
          )}
        </Grid>
      )}
    </label>
  )
}

const styles = {
  grid: {
    gridTemplateColumns: '76px 1fr',
    textAlign: 'left',
    alignItems: 'center',
  },
  label: {
    color: 'blackFaded',
    bg: 'transparent',
    fontFamily: 'body',
    lineHeight: '4rem',
    height: '64px',
    cursor: 'pointer',
    display: 'block',
    textAlign: 'center',
    position: 'relative',
    border: '1px solid',
    borderColor: 'whiteFaded',
    width: '100%',
    boxShadow: '0 4px 24px 0 rgba(30,37,44,0.16)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transition: 'all 0.3s ease',
      boxShadow:
        '0 4px 24px 0 rgba(149,152,171,0.16), 0 12px 48px 0 rgba(30,37,44,0.32)',
    },
  },
  input: {
    fontSize: 0,
    opacity: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    cursor: 'pointer',
  },
}

UploadImage.propTypes = {
  setImage: PropTypes.func,
}

export default UploadImage
