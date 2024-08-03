import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const DownloadLink = ({ fileUrl, fileName, children }) => {
    // Sanitize the fileUrl and fileName
    const sanitizedFileUrl = DOMPurify.sanitize(fileUrl);
    const sanitizedFileName = DOMPurify.sanitize(fileName);
    return (
        <a
            href={sanitizedFileUrl}
            download={sanitizedFileName}
            aria-label={`Download the file named ${sanitizedFileName}`}
        >
            <span>{children}</span>
        </a>
    );
};

DownloadLink.propTypes = {
    fileUrl: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    children: PropTypes.node
};

export default DownloadLink;