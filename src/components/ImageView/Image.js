import { observer } from 'mobx-react';
import { forwardRef, useCallback, useMemo } from 'react';
import { Block, Elem } from '../../utils/bem';
import messages from '../../utils/messages';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import './Image.styl';

export const Image = observer(forwardRef(({
  imageEntity,
  imageTransform,
  updateImageSize,
  usedValue,
  size,
}, ref) => {
  const imageSize = useMemo(() => {
    return {
      width: size.width === 1 ? '100%' : size.width,
      height: size.height === 1 ? 'auto' : size.height,
    };
  }, [size]);

  const onLoad = useCallback((event) => {
    updateImageSize(event);
    imageEntity.setImageLoaded(true);
  }, [updateImageSize, imageEntity]);

  return (
    <Block name="image" style={imageSize}>
      <ImageProgress
        downloading={imageEntity.downloading}
        progress={imageEntity.progress}
        error={imageEntity.error}
        src={imageEntity.src}
        usedValue={usedValue}
      />
      {imageEntity.downloaded ? (
        <ImageRenderer
          alt="image"
          ref={ref}
          src={imageEntity.currentSrc}
          onLoad={onLoad}
          isLoaded={imageEntity.imageLoaded}
          imageTransform={imageTransform}
        />
      ) : null}
    </Block>
  );
}));

const ImageProgress = observer(({
  downloading,
  progress,
  error,
  src,
  usedValue,
}) => {
  return downloading ? (
    <Block name="image-progress">
      <Elem name="message">Downloading image</Elem>
      <Elem tag="progress" name="bar" value={progress} min="0" max={1} step={0.0001}/>
    </Block>
  ) : error ? (
    <ImageLoadingError src={src} value={usedValue} />
  ) : null;
});

const ImageRenderer = observer(forwardRef(({
  src,
  onLoad,
  imageTransform,
  isLoaded,
}, ref) => {
  const imageStyles = useMemo(() => {
    const style = imageTransform ?? {};

    return { ...style, visibility: isLoaded ? 'visible' : 'hidden' };
  }, [imageTransform, isLoaded]);

  return (
    <img
      ref={ref}
      alt="image"
      src={src}
      onLoad={onLoad}
      style={imageStyles}
    />
  );
}));

const ImageLoadingError = ({ src, value }) => {
  const error = useMemo(() => {
    return messages.ERR_LOADING_HTTP({
      url: src,
      error: '',
      attr: value,
    });
  }, [src]);

  return (
    <ErrorMessage error={error}/>
  );
};
