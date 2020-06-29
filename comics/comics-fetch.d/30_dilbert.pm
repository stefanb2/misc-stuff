package ComicsFetch::dilbert;
use 5.030;
use strict;
use warnings;

use Date::Format;

sub get() {
    my @yesterday = localtime(time() - 86400);
    my $url       = strftime('https://dilbert.com/%Y-%m-%d',
                             @yesterday);
    ::get_comic_simple(
        $url,
        "dilbert",
        undef,
        class => "img-comic-container"
    );
}

1;
